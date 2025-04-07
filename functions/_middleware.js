export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  
  // اگر درخواست برای فایل‌های استاتیک بود، اجازه بده ادامه پیدا کنه
  if (url.pathname.startsWith('/assets/')) {
    return next(); // ادامه بده به درخواست‌های استاتیک
  }

  const password = url.searchParams.get("password");

  // چک کردن پسورد
  if (password !== env.PASSWORD) {
    return new Response(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh;">
          <form method="GET">
            <input type="password" name="password" placeholder="Enter Password" />
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }

  // اگر پسورد درست بود، ادامه بده به درخواست اصلی
  return next(); // ادامه بده به فایل استاتیک بعدی
}