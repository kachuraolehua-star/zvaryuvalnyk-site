import { notFound } from 'next/navigation';

// Этот файл ловит весь несуществующий мусор и принудительно выдает HTTP 404
export default function CatchAll() {
  notFound();
}