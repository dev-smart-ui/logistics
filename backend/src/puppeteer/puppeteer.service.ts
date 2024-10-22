import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  // @Cron(CronExpression.EVERY_MINUTE)
  // async scheduledScrape(): Promise<void> {
  //   const site = 'https://metabase.app.relaytms.com/public/question/760017e9-979a-4f47-a820-736ab4e7e797?ready_date='

  //   const data = await this.scrapeData(site)

  //   console.log(data)
  // }

  // async scrapeData(url: string, selector: string): Promise<any> {
  //   try {
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();
  
  //     // Переходимо на потрібну сторінку
  //     await page.goto(url, { waitUntil: 'networkidle0' }); // Чекаємо на завершення всіх запитів мережі
    
  //     // Витягуємо дані з колонки 1st Pick City
  //     const pickCities = await page.evaluate(() => {
  //       const rows = Array.from(document.querySelectorAll('table tbody tr'));
  //       // const headers = Array.from(document.querySelectorAll('table thead tr'));

  //       return {
  //         value: rows.map(row => {
  //           const cell = row.querySelector('td:nth-child(6)');
  //           return (cell as HTMLElement)?.innerText || ""; // Приведення до HTMLElement та витягуємо текст
  //         }),
  //         // header: headers.map(row => {
  //         //   const cell = row.querySelector('th:nth-child(6)');
  //         //   return (cell as HTMLElement)?.innerText || "";
  //         // }),
  //       }
  //     });
    
  //     // Закриваємо браузер
  //     await browser.close();
  
  //     return pickCities;
  //   } catch (err) {
  //     console.log('Error:', err);
  //     return [];
  //   }
  // }

  async scrapeData(url: string, selector: string): Promise<any> {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
  
      await page.goto(url, { waitUntil: 'networkidle0' });
  
      // Отримуємо заголовки колонок
      const headers = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('table thead th')).map(th => th.textContent?.trim() || '');
      });
  
      // Отримуємо рядки таблиці
      const rows = await page.evaluate((targetCity) => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
  
        let matchingRows = rows
          .map(row => {
            const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim() || '');
            if (cells.includes(targetCity)) {
              return cells;
            }
            return null;
          })
          .filter(row => row !== null);
  
        return matchingRows;
      }, selector);
  
      await browser.close();
  
      // Повертаємо дані разом із заголовками колонок
      return { headers, rows };
    } catch (err) {
      console.error('Error:', err);
      return { headers: [], rows: [] };
    }
  }
  

  async scrapeAllPages(url: string, selector: string): Promise<any> {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
  
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
  
      // Отримуємо заголовки колонок
      const headers = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('table thead th')).map(th => th.textContent?.trim() || '');
      });
  
      let allRows: string[][] = []; // Для збереження всіх рядків
      let hasNextPage = true; // Флаг для перевірки наявності наступної сторінки
  
      while (hasNextPage) {
        // Отримуємо рядки таблиці на поточній сторінці
        const rows = await page.evaluate((targetCity) => {
          const rows = Array.from(document.querySelectorAll('table tbody tr'));
          return rows
            .map(row => {
              const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim() || '');
              if (cells.includes(targetCity)) {
                return cells;
              }
              return null;
            })
            .filter(row => row !== null);
        }, selector);
  
        // Додаємо рядки з поточної сторінки до загального масиву
        allRows.push(...rows);
  
        // Перевіряємо наявність кнопки "Наступна сторінка" та переходимо до неї
        hasNextPage = await page.evaluate(() => {
          const nextButton = document.querySelector('button[aria-label="Next page"]');
          if (nextButton && !nextButton.hasAttribute('disabled')) {
            (nextButton as HTMLElement).click();
            return true;
          }
          return false;
        });
  
        // Чекаємо на завантаження нових рядків, якщо є наступна сторінка
        if (hasNextPage) {
          await page.waitForSelector('table tbody tr'); // Очікуємо на завантаження нових рядків
        }
      }
  
      await browser.close();
  
      // Повертаємо дані разом із заголовками колонок
      return { headers, rows: allRows };
    } catch (err) {
      console.error('Error:', err);
      return { headers: [], rows: [] };
    }
  }
  
  
}

