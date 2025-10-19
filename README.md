# 📊 Dinamik Chart Görselleştirme Uygulaması

Bu proje, MSSQL veritabanındaki Stored Procedure (SP), View veya Function çıktılarının dinamik olarak görselleştirilebilmesini sağlar.  
Kullanıcı, bağlantı bilgisini girip SP adını belirttiğinde veriler tablo halinde ve farklı **grafik tiplerinde (Bar, Line, Radar)** Chart.js ile görselleştirilebilir.

## Giriş Bilgileri
Server:   Server=ECE\MSSQLSERVER02;Database=TestDB;Trusted_Connection=True;TrustServerCertificate=True;
Stored Procedure Name: GetSalesSummary

## 🚀 Özellikler

| Özellik | Açıklama |
|----------|-----------|
| 🧩 **Veritabanı Entegrasyonu** | MSSQL veritabanına bağlanır, Stored Procedure çağırır ve sonuçları JSON olarak döner. |
| 🔐 **API Key & AES Şifreleme** | Connection String AES algoritması ile şifrelenir, API Key doğrulaması ile güvenli istek sağlanır. |
| 🧠 **Dinamik Grafik Yapısı** | Kullanıcı, gelen veride X/Y eksenlerini seçerek farklı grafik türlerinde görselleştirme yapabilir. |
| 🎨 **Renk Seçimi & Tema Desteği** | Grafik rengi kullanıcı tarafından seçilebilir. Dark / Light tema geçişi mevcuttur. |
| 📈 **Çoklu Grafik Desteği** | Aynı veriyle birden fazla grafik oluşturulabilir; her biri bağımsızdır. |
| 📱 **Responsive Arayüz** | Tüm grafikler mobil ve web ekranlarına uyumlu olacak şekilde esnek tasarlanmıştır. |
| 📥 **Grafik İndirme (PNG)** | Her grafik tek tuşla PNG formatında indirilebilir. |
| 🧾 **Loglama & Hata Yönetimi** | API işlemleri loglanır; SQL ve genel hatalar detaylı olarak yakalanır. |

---

## 🧰 Teknolojiler

**Backend**
- ASP.NET Core Web API (.NET 8)
- Microsoft SQL Server (MSSQL)
- Serilog / ILogger (Loglama)
- AES Encryption (System.Security.Cryptography)

**Frontend**
- HTML5, CSS3 (Bootstrap 5)
- JavaScript (jQuery)
- Chart.js (Veri görselleştirme)
- CryptoJS (Connection String şifreleme)

---

## ⚙️ Kurulum

### 1️⃣ Veritabanı Oluştur

```sql
CREATE DATABASE TestDB;
USE TestDB;

CREATE TABLE Sales (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(50),
    Quantity INT,
    Price DECIMAL(10,2)
);

INSERT INTO Sales (ProductName, Quantity, Price)
VALUES 
('Laptop', 5, 12000),
('Mouse', 20, 250),
('Keyboard', 10, 500),
('Monitor', 7, 2200);

GO

CREATE PROCEDURE GetSalesSummary
AS
BEGIN
    SELECT ProductName, Quantity, Price, (Quantity * Price) AS Total
    FROM Sales;
END
GO
```

---

### 2️⃣ Backend’i Çalıştır

📂 `DynamicChartVisualizer.API` projesi içinde:  
- `appsettings.json`’da log klasörünü ayarla:
  ```json
  {
    "Logging": { "LogLevel": { "Default": "Information" } },
    "AllowedHosts": "*"
  }
  ```
- `Program.cs` içinde:
  ```csharp
  builder.Logging.AddFile("logs/app_log.txt");
  ```

Çalıştır:
```bash
dotnet run
```

API otomatik olarak şu endpoint üzerinden hizmet verecek:
```
POST https://localhost:7296/api/data/execute-sp
```

---

### 3️⃣ Frontend’i Aç

📂 `wwwroot` klasöründe veya `index.html` dosyasında  
tarayıcıyla açarak uygulamayı kullan.



## 🔒 Güvenlik Özellikleri

| Özellik | Açıklama |
|----------|-----------|
| 🧾 **Loglama** | Her istek `logs/app_log.txt` dosyasına kaydedilir. |
| 🚨 **Exception Yönetimi** | SQL, ağ veya JSON hataları kullanıcıya açıklayıcı şekilde döner. |

---

## 🎨 Kullanıcı Arayüzü Özellikleri

| Özellik | Açıklama |
|----------|-----------|
| 🎨 **Renk Seçici** | Grafik için renk belirlenebilir. |
| 🌗 **Dark / Light Theme Toggle** | Tek tıkla tema değişimi yapılabilir. |
| 📋 **Veri Önizleme Tablosu** | SP sonucu tablo olarak gösterilir. |
| 📈 **Çoklu Grafik Desteği** | Kullanıcı birden fazla grafik oluşturabilir. |
| 📥 **Grafik İndir (PNG)** | Her grafik tek tıkla indirilebilir. |
| 📱 **Responsive Tasarım** | Mobil uyumlu görünüm. |

---

## 📁 Klasör Yapısı

```
DynamicChartVisualizer/
├── API/
│   ├── Controllers/
│   │   └── DataController.cs
│   ├── appsettings.json
│   ├── logs/
│   │   └── app_log.txt
├── Core/
│   ├── Helpers/
│   │   └── EncryptionHelper.cs
│
├── wwwroot/
│   ├── index.html
│   ├── app.js
│
└── README.md
```
<img width="1297" height="870" alt="image" src="https://github.com/user-attachments/assets/60e47fd4-504c-4605-86f0-34a9ad0d09a4" />
<img width="1567" height="642" alt="image" src="https://github.com/user-attachments/assets/008aaed8-cb0f-4e62-877f-71e1ae60ffa6" />


--
---

