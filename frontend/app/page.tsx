"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [data, setData] = useState<{ headers: string[], rows: string[][] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  // Стан логіну
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Перевірка логіну при завантаженні сторінки
  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('isLoggedIn');
    if (savedLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Відновлення значень з localStorage при завантаженні сторінки
  useEffect(() => {
    const savedUrl = localStorage.getItem('url');
    const savedSelector = localStorage.getItem('selector');
    if (savedUrl && savedSelector) {
      setUrl(savedUrl);
      setSelector(savedSelector);
      setIsAutoRefreshing(true);
    }
  }, []);

  // Автоматичне надсилання запиту кожні 20 секунд
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRefreshing && url && selector) {

      interval = setInterval(() => {
        handleSubmit();
      }, 20000);

      // Для першого завантаження
      if (!loading) {
        handleSubmit();
      }
    }
    return () => clearInterval(interval);
  }, [isAutoRefreshing, url, selector]);

  // Функція для обробки логіну
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Простий приклад перевірки логіну (замість реальної аутентифікації)
    if (username === 'dev@smart-ui.pro' && password === 'DevLogistics2024!') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); // Зберігаємо стан логіну
      setLoginError('');
    } else {
      setLoginError('Невірне ім\'я користувача або пароль');
    }
  };

  // Логаут
  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   localStorage.removeItem('isLoggedIn');
  // };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (!url || !selector) {
      setError('Обидва поля мають бути заповнені');
      return;
    }

    setError('');
    setLoading(true);
    setIsAutoRefreshing(true);

    // Зберігаємо в localStorage тільки після старту пошуку
    localStorage.setItem('url', url);
    localStorage.setItem('selector', selector);

    try {
      const response = await fetch('/api/puppeteer/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, selector }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
      setData({ headers: [], rows: [] });
    } finally {
      setLoading(false);
    }
  };

  const stopAutoRefresh = () => {
    setIsAutoRefreshing(false);
    localStorage.removeItem('url');
    localStorage.removeItem('selector');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl mb-4">Логін</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-[400px]">
          <input
            type="text"
            placeholder="Ім'я користувача"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
          />
          {loginError && <p className="text-red-500">{loginError}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2">
            Увійти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="mb-4 w-full flex items-end justify-center gap-4 mt-10">
        <div className="flex flex-col w-full max-w-[600px]">
          <label htmlFor="url" className="mb-1 font-semibold">Вставте посилання</label>
          <input
            id="url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 w-full"
            disabled={isAutoRefreshing}
          />
        </div>
        <div className="flex flex-col w-[300px]">
          <label htmlFor="selector" className="mb-1 font-semibold">Введіть місто</label>
          <input
            id="selector"
            type="text"
            placeholder="Місто"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            className="border p-2 w-full"
            disabled={isAutoRefreshing}
          />
        </div>

        {/* Кнопка "Пошук..." */}
        <button
          type="submit"
          className={`p-2 w-40 h-[41px] text-white ${isAutoRefreshing ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-500'
            }`}
          disabled={isAutoRefreshing || loading}
        >
          {isAutoRefreshing ? 'Пошук...' : 'Шукати'}
        </button>

        {/* Кнопка "Зупинити" */}
        <button
          type="button"
          onClick={stopAutoRefresh}
          className={`p-2 w-40 h-[41px] text-white ${!isAutoRefreshing ? 'bg-red-500 opacity-50 cursor-not-allowed' : 'bg-red-500'
            }`}
          disabled={!isAutoRefreshing}
        >
          Зупинити
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {data && data.headers.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse border mt-4">
            <thead>
              <tr>
                {data.headers.map((header, index) => (
                  <th key={index} className="border px-4 py-2 bg-gray-200 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`border px-4 py-2 whitespace-nowrap ${cell === selector ? 'bg-yellow-200 font-bold' : ''
                        }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
