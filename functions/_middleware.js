export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // بررسی اینکه آیا کاربر قبلاً وارد شده است یا خیر
  const cookies = request.headers.get("Cookie") || "";
  const isAuthenticated = cookies.includes("auth=true");

  // اگر کاربر قبلاً وارد شده باشد یا درخواست به فایل‌های استاتیک هست، ادامه بده
  if (isAuthenticated || url.pathname.startsWith('/assets/')) {
    return next();
  }

  const password = url.searchParams.get("password");

  // اگر پسورد اشتباه وارد شد، صفحه ورود نمایش داده می‌شود
  if (password !== env.PASSWORD) {
    return new Response(`
      <html>
        <head>
          <script>
            // ذخیره وضعیت ورود در LocalStorage
            if (localStorage.getItem('auth') === 'true') {
              window.location.href = '/'; // اگر کاربر قبلاً وارد شده، به صفحه اصلی برو
            }
          </script>
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

  // اگر پسورد درست بود، در LocalStorage وضعیت کاربر را ذخیره می‌کنیم
  const response = await next();

  // اینجا اسکریپت جاوا اسکریپت را به صفحه اضافه می‌کنیم که وضعیت ورود را ذخیره کند
  response.headers.append('Content-Security-Policy', "script-src 'self'");

  return response;
}