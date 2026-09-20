import * as cheerio from "cheerio";
import type { Website } from "./types/website.types.js";
import { chromium } from "playwright"

export async function scrapeWebsite(url: string) {

    console.log("Starting browser...")
    const browser = await chromium.launch();

    try {
        const page = await browser.newPage();

        let parsedUrl: string;

        if (url.startsWith("http://") || url.startsWith("https://")) parsedUrl = url;
        else parsedUrl = "https://" + url;

        try {
            console.log("Loading website content...")
            await page.goto(parsedUrl, { timeout: 60_000 });
            console.log("Loaded")
        } catch (err) {
            throw new Error(`Failed to load ${parsedUrl}`, { cause: "Navigation timeout after 60s" });
        }

        const html = await page.content()

        const $ = cheerio.load(html);

        const website: Website = {

            url: parsedUrl,

            title: $("title").text().trim(),

            description:
                $('meta[name="description"]').attr("content")?.trim() || "",

            headings: $("h1, h2, h3")
                .map((_, element) => $(element).text().trim())
                .get()
                .filter(Boolean),

            links: $("a")
                .map((_, element) => $(element).attr("href"))
                .get()
                .filter(Boolean)
                .filter((
                    link: string,
                    index: number,
                    array: string[]
                ) => array.indexOf(link) === index),

            images: $("img")
                .filter((_, element) => Boolean($(element).attr("src")))
                .map((_, element) => ({
                    src: $(element).attr("src")!,
                    alt: $(element).attr("alt") || ""
                }))
                .get()
        };

        return website;
    } catch (err) {
        console.error("Error scraping website data:", err);
        throw err
    } finally {
        await browser.close();
    }
}