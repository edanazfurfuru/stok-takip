import { test, expect } from '@playwright/test';

test('Sayfaya gir ve başlığı kontrol et', async ({ page }) => {
  // 1. Sayfaya git
  await page.goto('http://localhost:3000');

  // 2. "StokTakip" yazısı var mı kontrol et
  const appName = page.locator('text=StokTakip').first();
  await expect(appName).toBeVisible();
});

test('Dashboard sayfası açılıyor', async ({ page }) => {
  // 1. Sayfaya git
  await page.goto('http://localhost:3000');

  // 2. Dashboard başlığı var mı?
  const dashboardTitle = page.locator('h2:has-text("Dashboard")');
  await expect(dashboardTitle).toBeVisible();

  // 3. Sayfa içeriği yüklendi mi?
  await page.waitForLoadState('networkidle');
});

test('Sidebar navigasyonu çalışıyor', async ({ page }) => {
  // 1. Sayfaya git
  await page.goto('http://localhost:3000');

  // 2. Kategoriler linkine tıkla
  await page.click('text=Kategoriler');

  // 3. Sayfanın yüklenmesini bekle
  await page.waitForLoadState('networkidle');

  // 4. Kategoriler başlığı görüntüleniyor mu?
  const title = page.locator('h2:has-text("Kategoriler")');
  await expect(title).toBeVisible();
});

test('Ürünler sayfasına git', async ({ page }) => {
  // 1. Sayfaya git
  await page.goto('http://localhost:3000');

  // 2. Ürünler linkine tıkla
  await page.click('text=Ürünler');

  // 3. Sayfanın yüklenmesini bekle
  await page.waitForLoadState('networkidle');

  // 4. Ürünler başlığı görüntüleniyor mu?
  const title = page.locator('h2:has-text("Ürünler")');
  await expect(title).toBeVisible();
});

test('Yeni kategori oluştur (Yavaş - Video Görüntüleme İçin)', async ({ page }) => {
  // 1. Sayfaya git
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000); // 1 saniye bekle

  // 2. Kategoriler sayfasına git
  await page.click('text=Kategoriler');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);

  // 3. Kategoriler başlığı var mı kontrol et
  const title = page.locator('h2:has-text("Kategoriler")');
  await expect(title).toBeVisible();
  await page.waitForTimeout(500);

  // 4. "Yeni Kategori" butonuna tıkla
  const newBtn = page.locator('button:has-text("+ Yeni Kategori")');
  await expect(newBtn).toBeVisible();
  await page.waitForTimeout(300);
  await newBtn.click();
  await page.waitForTimeout(800); // Modal açılması için bekle

  // 5. Modal açıldı mı kontrol et
  const modalTitle = page.locator('h2:has-text("Yeni Kategori")');
  await expect(modalTitle).toBeVisible();
  await page.waitForTimeout(500);

  // 6. Form doldur - Ad alanı (benzersiz ad için timestamp kulllan)
  const timestamp = Date.now();
  const inputs = page.locator('input[class*="border"]');
  await inputs.nth(0).fill(`Test Kategorisi ${timestamp}`);
  await page.waitForTimeout(600); // Yazma animasyonunu görmek için

  // 7. Form doldur - Açıklama alanı
  await inputs.nth(1).fill('Bu bir test kategorisidir');
  await page.waitForTimeout(600);

  // 8. Kaydet butonuna tıkla
  const saveBtn = page.locator('button:has-text("Kaydet")');
  await expect(saveBtn).toBeVisible();
  await page.waitForTimeout(300);
  await saveBtn.click();
  await page.waitForTimeout(800);

  // 9. Sayfanın yüklenmesini bekle
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // 10. Modal kapandı mı kontrol et
  await expect(modalTitle).not.toBeVisible();
  await page.waitForTimeout(300);

  // 11. Tabloda yeni kategori görüntüleniyor mu kontrol et
  const categoryInTable = page.locator(`text=Test Kategorisi ${timestamp}`);
  await expect(categoryInTable).toBeVisible();
  await page.waitForTimeout(500);
});

test('Yeni ürün oluştur (Yavaş - Video Görüntüleme İçin)', async ({ page }) => {
  // 1. Sayfaya git
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // 2. Ürünler sayfasına git
  await page.click('text=Ürünler');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);

  // 3. Ürünler başlığı var mı kontrol et
  const title = page.locator('h2:has-text("Ürünler")');
  await expect(title).toBeVisible();
  await page.waitForTimeout(500);

  // 4. "Yeni Ürün" butonuna tıkla
  const newBtn = page.locator('button:has-text("+ Yeni Ürün")');
  await expect(newBtn).toBeVisible();
  await page.waitForTimeout(300);
  await newBtn.click();
  await page.waitForTimeout(1000); // Modal açılması için bekle

  // 5. Modal açıldı mı kontrol et
  const modalTitle = page.locator('h2:has-text("Yeni Ürün")');
  await expect(modalTitle).toBeVisible();
  await page.waitForTimeout(500);

  // 6. Form alanlarını doldur - Ad
  const timestamp = Date.now();
  const productName = `Test Ürün ${timestamp}`;
  await page.fill('label:has-text("Ad") ~ input', productName);
  await page.waitForTimeout(400);

  // 7. SKU doldur
  const sku = `SKU-${timestamp}`;
  await page.fill('label:has-text("SKU") ~ input', sku);
  await page.waitForTimeout(400);

  // 8. Fiyat doldur
  await page.fill('label:has-text("Fiyat") ~ input', '999');
  await page.waitForTimeout(400);

  // 9. Min. Stok doldur
  await page.fill('label:has-text("Min. Stok") ~ input', '5');
  await page.waitForTimeout(400);

  // 10. Başlangıç Stoku doldur
  await page.fill('label:has-text("Başlangıç Stoku") ~ input', '50');
  await page.waitForTimeout(400);

  // 11. Kategori seç (ilk kategoriye tıkla)
  const categorySelect = page.locator('label:has-text("Kategori") ~ select');
  await categorySelect.click();
  await page.waitForTimeout(300);
  await page.locator('select').nth(0).selectOption({ index: 0 });
  await page.waitForTimeout(400);

  // 12. Tedarikçi seç (ilk tedarikçiye tıkla)
  const supplierSelect = page.locator('label:has-text("Tedarikçi") ~ select');
  await supplierSelect.click();
  await page.waitForTimeout(300);
  await page.locator('select').nth(1).selectOption({ index: 0 });
  await page.waitForTimeout(400);

  // 13. Açıklama doldur
  const descInput = page.locator('label:has-text("Açıklama") ~ input');
  if (await descInput.count() > 0) {
    await descInput.fill('Test ürün açıklaması');
    await page.waitForTimeout(400);
  }

  // 14. Kaydet butonuna tıkla
  const saveBtn = page.locator('button:has-text("Kaydet")');
  await expect(saveBtn).toBeVisible();
  await page.waitForTimeout(300);
  await saveBtn.click();
  await page.waitForTimeout(1000); // İşlem tamamlanması için bekle

  // 15. Sayfanın yüklenmesini bekle
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // 16. Modal kapandı mı kontrol et
  await expect(modalTitle).not.toBeVisible();
  await page.waitForTimeout(500);

  // 17. Tabloda yeni ürün görüntüleniyor mu kontrol et
  const productInTable = page.locator(`text=${productName}`);
  await expect(productInTable).toBeVisible();
  await page.waitForTimeout(500);
});
