import asyncio
import json
import logging
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urlsplit, urlunsplit, parse_qs
import xml.etree.ElementTree as ET
import aiohttp

from crawl4ai import AsyncWebCrawler

logging.getLogger().setLevel(logging.CRITICAL)

visited_urls = set()
extracted_data = {}
failed_urls = []
MAX_WORKERS = 100
SITEMAP_URL = "https://mosdac.gov.in/sitemap.xml"

disallowed_paths = [
    "/includes/", "/misc/", "/modules/", "/profiles/", "/scripts/", "/themes/",
    "/CHANGELOG.txt", "/cron.php", "/install.php", "/INSTALL", "/LICENSE.txt", "/MAINTAINERS.txt",
    "/update.php", "/UPGRADE.txt", "/xmlrpc.php", "/admin/", "/search/", "/user/"
]

def is_allowed(url):
    parsed = urlparse(url)
    return not any(parsed.path.startswith(path) for path in disallowed_paths)

def strip_lang_param(url):
    split = urlsplit(url)
    query = parse_qs(split.query)
    if "language" in query and query["language"] == ["hi"]:
        new_query = "&".join([f"{k}={v[0]}" for k, v in query.items() if k != "language"])
        return urlunsplit((split.scheme, split.netloc, split.path, new_query, ""))
    return url

async def fetch_sitemap_urls(sitemap_url):
    async with aiohttp.ClientSession() as session:
        async with session.get(sitemap_url) as response:
            xml_content = await response.text()
            root = ET.fromstring(xml_content)
            urls = []

            if root.tag.endswith("sitemapindex"):
                loc_tags = [elem.text for elem in root.iter() if elem.tag.endswith("loc")]
                for loc in loc_tags:
                    async with session.get(loc) as sub_resp:
                        sub_xml = await sub_resp.text()
                        sub_root = ET.fromstring(sub_xml)
                        urls += [e.text for e in sub_root.iter() if e.tag.endswith("loc")]
            else:
                urls = [e.text for e in root.iter() if e.tag.endswith("loc")]

            return [url for url in urls if is_allowed(url)]

async def crawl_worker(crawler, queue):
    while True:
        try:
            url = await queue.get()
            url = strip_lang_param(url)

            if url in visited_urls:
                queue.task_done()
                continue

            visited_urls.add(url)
            print(f"🔍 Crawling: {url}")

            retries = 3
            for attempt in range(retries):
                try:
                    result = await asyncio.wait_for(
                        crawler.arun(url=url, wait=5), timeout=30
                    )
                    soup = BeautifulSoup(result.html, "html.parser")
                    main_content = soup.find("main") or soup.find("div", id="content") or soup.body

                    title = soup.title.string.strip() if soup.title else "No Title"
                    if main_content:
                        text = main_content.get_text(separator="\n", strip=True)
                    else:
                        text = soup.get_text(separator="\n", strip=True)

                    if not text.strip():
                        raise Exception("Page content is empty")

                    extracted_data[url] = {
                        "url": url,
                        "title": title,
                        "content": text
                    }
                    break

                except Exception as e:
                    if attempt == retries - 1:
                        print(f"❌ {url} failed after {retries} attempts — {e}")
                        failed_urls.append(url)

            queue.task_done()

        except asyncio.CancelledError:
            break

async def main():
    print("⏳ Fetching sitemap...")
    urls = await fetch_sitemap_urls(SITEMAP_URL)
    print(f"✅ Found {len(urls)} URLs in sitemap.")

    queue = asyncio.Queue()
    for url in urls:
        await queue.put(url)

    async with AsyncWebCrawler() as crawler:
        tasks = [asyncio.create_task(crawl_worker(crawler, queue)) for _ in range(MAX_WORKERS)]
        await queue.join()
        for task in tasks:
            task.cancel()

    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)

    if failed_urls:
        with open("failed_urls.txt", "w", encoding="utf-8") as f:
            for url in failed_urls:
                f.write(url + "\n")

    print(f"\n✅ Crawled {len(extracted_data)} pages. Saved to data.json")
    if failed_urls:
        print(f"⚠️ {len(failed_urls)} pages failed. See failed_urls.txt")

if __name__ == "__main__":
    asyncio.run(main())
