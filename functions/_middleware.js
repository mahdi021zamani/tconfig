export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // بررسی کوکی‌ها برای اینکه ببینیم کاربر وارد شده است یا نه
  const cookies = request.headers.get("Cookie") || "";
  const isAuthenticated = cookies.includes("auth=true");

  // اگر کاربر وارد شده باشد یا درخواست به فایل‌های استاتیک هست، ادامه بده
  if (isAuthenticated || url.pathname.startsWith('/assets/')) {
    return next();
  }

  // اگر پسورد وارد شده است، بررسی می‌کنیم
  const password = url.searchParams.get("password");

  // اگر پسورد صحیح نیست، صفحه ورود نمایش داده می‌شود
  if (password !== env.PASSWORD) {
    return new Response(`
      <html>
        <head>
          <title>Login</title>
        </head>
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

  // اگر پسورد صحیح بود، کوکی auth=true را تنظیم می‌کنیم
  const response = await next();

  // تنظیم کوکی برای جلوگیری از درخواست دوباره پسورد
  response.headers.append('Set-Cookie', 'auth=true; Path=/; SameSite=Lax; Max-Age=86400');

  return response;
}