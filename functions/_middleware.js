export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // بررسی کوکی برای اینکه ببینیم کاربر وارد شده است یا نه
  const cookies = request.headers.get("Cookie") || "";
  const isAuthenticated = cookies.includes("auth=true");

  // اگر کاربر قبلاً وارد شده است یا درخواستی برای فایل‌های استاتیک باشد، به مسیر بعدی برو
  if (isAuthenticated || url.pathname.startsWith('/assets/')) {
    return next();
  }

  const password = url.searchParams.get("password");

  // اگر پسورد درست نبود، صفحه ورود نمایش داده می‌شود
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

  // اگر پسورد درست بود، کوکی auth را تنظیم کن و ادامه بده
  const response = await next();

  // اینجا تغییراتی انجام می‌دهیم که کوکی به درستی تنظیم شود
  response.headers.append('Set-Cookie', 'auth=true; Path=/; HttpOnly; Secure; SameSite=Strict');
  return response;
}