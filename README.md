> فا
# قالب رزومه (فرانت اند و بکند)
### تکنولوژی‌ها: جاوا اسکریپت، تایپ اسکریپت، نود جی اس، ای جی اس

یک قالب کامل است. و فقط نیاز است که آن را روی سروری که دارای نود جی اس است اجرا کنید. ( با این دستورات: npm run build / npm start )

این برنامه به دیتابیس احتیاجی ندارد. اطلاعات زا از روی فایلی با این مسیر میخواند `/public/APP/content.json`.

این برنامه‌ است برای ساخت رزومه خودتان با نام دامنه خودتان. و این عملکردها را دارد:
- نمایش رزومه‌تان
- پنل مدیریت وبسایتتان، برای نوشتن رزومه خود یا سئو کردن وبسایتتان
- یک فایل منییجر که فایلتان را مدیریت کنید

همچنین میتوانید فایل های html,css,js دیگر هم برای ساخت صفححات استاتیک وب دیپلوی کنید. فقط آن را در مسیر پوشه `/public` قرار دهید. (برنامه مسیر  را نادیده میگیرد. و بجای آن مسیر `/` را دارید).

مثال: `https://example.com/public/my-projects/index.html` -> `https://example.com/my-projects/index.html`

فایل منیحر پوشه `public` را مدیریت می‌کند.

این متغییرهای محیطی را بر روی سرور خود تنظیم کنید:

- PORT="4000"
- DEBUG="app:main"
- NODE_ENV="production"
- CORS_ALLOW_ORIGIN="*"
- Content_Security_Policy_script_src=""
- JWT_SESSION_KEY=""    (چندین کاراکتر رندوم وارد کنید*)
- C_S_SECRET=""         (چندین کاراکتر رندوم وارد کنید*)
- OWNER_PASSWORD=""     (یک پسورد وارد کنید. این پسورد برای ورود شما به صفحه پنل مدیریتتان است. از آن در آدرس `/login` استفاده میکنید*)

#### *توجه: اکر دانشی درباره تکنولوژی های گفته شده ندارید، به این فایل ها و پوشه ها دست نزنید: `/APP`, `/manifest.json`*

شما این مسیرها را برای اجرای این برنامه دارید:
- `/`
- `/edit/content`
- `/edit/file-manager/dir`
- `/login`

----------
> en

# Resume-Template (front-end & back-end)

### Tec: JavaScript , TypeScript , NodeJs , EJS view engine

It is a complate template. just deploy on server and run app with NodeJs. (With this command: npm run build / npm start)

It does not need database. This program read and write data on `/public/APP/content.json`.

This is a program for create resume or CV website with your domain. And you have this functionality:
- Preview of your Resume or CV
- Conrol panel for your website, to write resume and SEO your resume website
- File manager to mange your files

You can deploay more html, css, js files to add more static pages. Just add on `public` path directory. (the program ignore `/public`. and yout have `/` insted of).

example: `https://example.com/public/my-projects/index.html` -> `https://example.com/my-projects/index.html`

The file manager, manage `public` directory.

Set these Environment Variables on your sesrver:

- PORT="4000"
- DEBUG="app:main"
- NODE_ENV="production"
- CORS_ALLOW_ORIGIN="*"
- Content_Security_Policy_script_src=""
- JWT_SESSION_KEY=""    (set a random characters*)
- C_S_SECRET=""         (set a random characters*)
- OWNER_PASSWORD=""     (set a password. to login on your control panel. it use on `/login`*)

#### *WARNING: If you don't have a knowledges of these technology, don't change these directories and files: `/APP`, `/manifest.json`*

You have this routes in this program(website):
- `/`
- `/edit/content`
- `/edit/file-manager/dir`
- `/login`