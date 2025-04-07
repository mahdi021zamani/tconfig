export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // بررسی اینکه آیا کوکی ورود وجود دارد
  const cookies = request.headers.get("Cookie");
  const isAuthenticated = cookies && cookies.includes("auth=true");

  // اگر کاربر وارد شده است، درخواست را به ادامه مسیر بفرست
  if (isAuthenticated || url.pathname.startsWith('/assets/')) {
    return next(); // ادامه بده به فایل استاتیک بعدی یا مسیر اصلی
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

  // اگر پسورد درست بود، کوکی را تنظیم می‌کنیم و ادامه می‌دهیم
  const response = await next();
  response.headers.append('Set-Cookie', 'auth=true; Path=/; HttpOnly; Secure; SameSite=Strict');
  return response;
}