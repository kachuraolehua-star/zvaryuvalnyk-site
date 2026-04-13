'use server';

/**
 * Server Action для проверки учётных данных администратора.
 * Выполняется ТОЛЬКО на сервере — секреты никогда не попадают в клиентский JS-бандл.
 *
 * Переменные окружения задаются в Vercel Dashboard → Settings → Environment Variables:
 *   ADMIN_LOGIN=<ваш_логин>
 *   ADMIN_PASS=<ваш_пароль>
 *
 * Для локальной разработки создай файл .env.local (он уже в .gitignore):
 *   ADMIN_LOGIN=admin
 *   ADMIN_PASS=zvaryar2026
 */
export async function verifyAdmin(login, pass) {
  const validLogin = process.env.ADMIN_LOGIN;
  const validPass  = process.env.ADMIN_PASS;

  // Защита от случая, когда переменные не заданы
  if (!validLogin || !validPass) {
    console.error('[auth] Переменные ADMIN_LOGIN или ADMIN_PASS не заданы в окружении!');
    return false;
  }

  return login === validLogin && pass === validPass;
}
