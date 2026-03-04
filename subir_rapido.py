#!/usr/bin/env python3
"""
subir_rapido.py
Sube 25 productos a Strapi (ZetaGadget) SIN imágenes, SIN brand, SIN featured.

Requisitos:
    pip install requests --break-system-packages

Uso:
    python3 subir_rapido.py
"""

import sys
import requests

# ── Configuración ─────────────────────────────────────────────────────────────

STRAPI_URL   = "https://api.zetagadget.es"
STRAPI_TOKEN = "77a1a7e642d9ea38ff65f9daf768939057edaf5e085e05183d83172410333ede7e3fe61fa6598b656085b8962e30e7d447645be900ade98ba120c04ad5dfa0eff8553d7773d72107d7ac6f8d54c95df93c5d16cc465b63f1fef185fa373e0302114224078cd8f268412ee9c60d14273c01a5d2662866e6a0058fbee20dfd70e0"  # ← Pon aquí tu JWT token de Strapi

# ── Productos ─────────────────────────────────────────────────────────────────

PRODUCTOS = [

    # ── SMARTPHONES ──────────────────────────────────────────────────────────
    {
        "name": "Samsung Galaxy A55 5G 128GB",
        "slug": "samsung-galaxy-a55-5g-128gb",
        "shortDescription": "Pantalla Super AMOLED 6,6\", Exynos 1480, cámara triple 50 MP y batería 5000 mAh con carga 25 W.",
        "description": "El Samsung Galaxy A55 5G es la opción perfecta para quienes buscan un smartphone potente sin pagar precio de gama alta. Su pantalla Super AMOLED de 6,6\" ofrece colores vivos y negros profundos, ideal para ver contenido multimedia. El procesador Exynos 1480 garantiza un rendimiento fluido en el día a día, y su triple cámara de 50 MP captura fotos con gran detalle. La batería de 5000 mAh con carga de 25 W te mantiene conectado todo el día.",
        "price": 449,
        "stock": 30,
        "category": "smartphones",
        "specifications": [
            {"key": "Pantalla", "value": "6,6\" Super AMOLED FHD+ 120Hz"},
            {"key": "Procesador", "value": "Exynos 1480"},
            {"key": "RAM", "value": "8 GB"},
            {"key": "Almacenamiento", "value": "128 GB"},
            {"key": "Cámara principal", "value": "50 MP + 12 MP + 5 MP"},
            {"key": "Batería", "value": "5000 mAh, carga 25W"},
            {"key": "Sistema operativo", "value": "Android 14"},
        ],
    },
    {
        "name": "Xiaomi 14 Ultra 512GB",
        "slug": "xiaomi-14-ultra-512gb",
        "shortDescription": "Cámara Leica de 1\", Snapdragon 8 Gen 3, LTPO AMOLED 120 Hz y carga inalámbrica 80 W.",
        "description": "El Xiaomi 14 Ultra redefine la fotografía móvil con su sistema de cámara Leica y sensor de 1 pulgada que captura imágenes extraordinarias incluso en condiciones de poca luz. El Snapdragon 8 Gen 3 ofrece el máximo rendimiento para gaming, multitarea y IA. Su pantalla LTPO AMOLED se adapta entre 1 y 120 Hz para ahorrar batería, y la carga inalámbrica de 80 W lo repone en minutos.",
        "price": 1299,
        "stock": 12,
        "category": "smartphones",
        "specifications": [
            {"key": "Pantalla", "value": "6,73\" LTPO AMOLED 4K 120Hz"},
            {"key": "Procesador", "value": "Snapdragon 8 Gen 3"},
            {"key": "RAM", "value": "16 GB"},
            {"key": "Almacenamiento", "value": "512 GB"},
            {"key": "Cámara principal", "value": "50 MP Leica sensor 1\""},
            {"key": "Batería", "value": "5000 mAh, carga 90W / inalámbrica 80W"},
            {"key": "Sistema operativo", "value": "Android 14, HyperOS"},
        ],
    },
    {
        "name": "OnePlus 12 256GB",
        "slug": "oneplus-12-256gb",
        "shortDescription": "Snapdragon 8 Gen 3, pantalla LTPO3 AMOLED 120 Hz, cámara Hasselblad y carga SuperVOOC 100 W.",
        "description": "El OnePlus 12 combina el mejor hardware del mercado con una experiencia de usuario ultrarrápida. La colaboración con Hasselblad eleva la calidad fotográfica con calibración de color natural y modos profesionales. Su carga SuperVOOC de 100 W llena la batería de 5400 mAh en apenas 25 minutos, y OxygenOS ofrece una interfaz limpia y fluida.",
        "price": 899,
        "stock": 18,
        "category": "smartphones",
        "specifications": [
            {"key": "Pantalla", "value": "6,82\" LTPO3 AMOLED QHD+ 120Hz"},
            {"key": "Procesador", "value": "Snapdragon 8 Gen 3"},
            {"key": "RAM", "value": "12 GB"},
            {"key": "Almacenamiento", "value": "256 GB"},
            {"key": "Cámara principal", "value": "50 MP Hasselblad"},
            {"key": "Batería", "value": "5400 mAh, carga 100W"},
            {"key": "Sistema operativo", "value": "Android 14, OxygenOS 14"},
        ],
    },
    {
        "name": "Google Pixel 9 Pro 256GB",
        "slug": "google-pixel-9-pro-256gb",
        "shortDescription": "Chip Google Tensor G4, pantalla LTPO OLED 120 Hz, cámara 50 MP con IA avanzada y 7 años de actualizaciones.",
        "description": "El Google Pixel 9 Pro es el smartphone con la IA más avanzada del mercado gracias al chip Tensor G4, diseñado específicamente por Google. Sus funciones fotográficas basadas en inteligencia artificial, como Best Take, Magic Eraser y Photo Unblur, lo convierten en la mejor cámara de su clase. Además, Google garantiza 7 años de actualizaciones de Android y seguridad.",
        "price": 1099,
        "stock": 15,
        "category": "smartphones",
        "specifications": [
            {"key": "Pantalla", "value": "6,3\" LTPO OLED QHD+ 120Hz"},
            {"key": "Procesador", "value": "Google Tensor G4"},
            {"key": "RAM", "value": "16 GB"},
            {"key": "Almacenamiento", "value": "256 GB"},
            {"key": "Cámara principal", "value": "50 MP + 48 MP ultrawide + 48 MP teleobjetivo"},
            {"key": "Batería", "value": "4700 mAh, carga 27W"},
            {"key": "Sistema operativo", "value": "Android 14 (7 años actualizaciones)"},
        ],
    },
    {
        "name": "Motorola Edge 50 Pro 256GB",
        "slug": "motorola-edge-50-pro-256gb",
        "shortDescription": "Snapdragon 7s Gen 2, pantalla pOLED curva 144 Hz, cámara principal 50 MP y carga TurboPower 125 W.",
        "description": "El Motorola Edge 50 Pro destaca por su carga TurboPower de 125 W, una de las más rápidas de la gama media, capaz de cargar completamente en menos de 20 minutos. Su pantalla pOLED curva de 144 Hz ofrece una experiencia visual premium, y la cámara de 50 MP con OIS captura fotos nítidas en cualquier situación.",
        "price": 499,
        "stock": 25,
        "category": "smartphones",
        "specifications": [
            {"key": "Pantalla", "value": "6,7\" pOLED FHD+ 144Hz curva"},
            {"key": "Procesador", "value": "Snapdragon 7s Gen 2"},
            {"key": "RAM", "value": "12 GB"},
            {"key": "Almacenamiento", "value": "256 GB"},
            {"key": "Cámara principal", "value": "50 MP OIS + 13 MP ultrawide + 10 MP teleobjetivo"},
            {"key": "Batería", "value": "4500 mAh, carga 125W"},
            {"key": "Sistema operativo", "value": "Android 14"},
        ],
    },

    # ── ACCESORIOS ────────────────────────────────────────────────────────────
    {
        "name": "Razer DeathAdder V3 HyperSpeed",
        "slug": "razer-deathadder-v3-hyperspeed",
        "shortDescription": "Ratón gaming inalámbrico ultraligero 63 g, sensor Focus X 18 000 DPI y batería hasta 300 horas.",
        "description": "El Razer DeathAdder V3 HyperSpeed lleva el icónico diseño ergonómico DeathAdder a un nuevo nivel de ligereza con solo 63 gramos. La tecnología inalámbrica HyperSpeed de 2,4 GHz ofrece una conexión más rápida que muchos ratones con cable. El sensor óptico Focus X de 18 000 DPI garantiza una precisión absoluta en cualquier superficie.",
        "price": 79,
        "stock": 50,
        "category": "accesorios",
        "specifications": [
            {"key": "Tipo", "value": "Inalámbrico 2,4 GHz"},
            {"key": "Peso", "value": "63 g"},
            {"key": "Sensor", "value": "Focus X óptico 18 000 DPI"},
            {"key": "Botones", "value": "6 programables"},
            {"key": "Batería", "value": "Hasta 300 horas"},
            {"key": "Conexión", "value": "USB HyperSpeed dongle"},
            {"key": "Compatibilidad", "value": "PC / Mac"},
        ],
    },
    {
        "name": "Logitech MX Keys S",
        "slug": "logitech-mx-keys-s",
        "shortDescription": "Teclado inalámbrico retroiluminado para productividad, compatible con Windows, macOS y Linux.",
        "description": "El Logitech MX Keys S es el teclado definitivo para profesionales que pasan horas frente al ordenador. Sus teclas esféricas con hueco central se adaptan a la forma de los dedos para una escritura más precisa y cómoda. Se conecta hasta 3 dispositivos simultáneamente y permite cambiar entre ellos con un solo botón.",
        "price": 119,
        "stock": 35,
        "category": "accesorios",
        "specifications": [
            {"key": "Tipo", "value": "Teclado inalámbrico"},
            {"key": "Conexión", "value": "Bluetooth / USB Logi Bolt"},
            {"key": "Dispositivos simultáneos", "value": "3"},
            {"key": "Retroiluminación", "value": "Sí, adaptativa"},
            {"key": "Batería", "value": "Hasta 10 días con retroiluminación"},
            {"key": "Distribución", "value": "Español"},
            {"key": "Compatibilidad", "value": "Windows / macOS / Linux"},
        ],
    },
    {
        "name": "Anker 737 Power Bank 24000 mAh",
        "slug": "anker-737-power-bank-24000mah",
        "shortDescription": "Batería portátil 24000 mAh con carga bidireccional 140 W, pantalla LCD y tres puertos simultáneos.",
        "description": "El Anker 737 es una de las baterías portátiles más potentes del mercado para uso personal. Con 140 W de carga bidireccional puede cargar un portátil MacBook Pro en menos de una hora, o tres dispositivos simultáneamente. Su pantalla LCD muestra en tiempo real el nivel de batería, la potencia de entrada y salida, y el tiempo restante estimado.",
        "price": 99,
        "stock": 45,
        "category": "accesorios",
        "specifications": [
            {"key": "Capacidad", "value": "24000 mAh"},
            {"key": "Potencia máxima", "value": "140 W (bidireccional)"},
            {"key": "Puertos", "value": "2× USB-C + 1× USB-A"},
            {"key": "Pantalla", "value": "LCD informativa"},
            {"key": "Carga simultánea", "value": "Sí, 3 dispositivos"},
            {"key": "Peso", "value": "624 g"},
            {"key": "Compatibilidad", "value": "Portátiles, tablets, smartphones"},
        ],
    },
    {
        "name": "Keychron Q1 Pro QMK/VIA",
        "slug": "keychron-q1-pro-qmk-via",
        "shortDescription": "Teclado mecánico 75% aluminio CNC, inalámbrico Bluetooth 5.1, switches Keychron y retroiluminación RGB.",
        "description": "El Keychron Q1 Pro es la cima de los teclados mecánicos personalizables. Fabricado en aluminio CNC con junta de silicona para amortiguar las pulsaciones, ofrece una experiencia de escritura silenciosa y satisfactoria. Compatible con QMK/VIA para reprogramar cualquier tecla, y funciona tanto por cable como inalámbrico por Bluetooth 5.1 con hasta 3 dispositivos.",
        "price": 199,
        "stock": 18,
        "category": "accesorios",
        "specifications": [
            {"key": "Formato", "value": "75% (84 teclas)"},
            {"key": "Carcasa", "value": "Aluminio CNC"},
            {"key": "Switches", "value": "Keychron K Pro (intercambiables)"},
            {"key": "Conexión", "value": "USB-C / Bluetooth 5.1"},
            {"key": "Retroiluminación", "value": "RGB por tecla"},
            {"key": "Software", "value": "QMK / VIA"},
            {"key": "Batería", "value": "4000 mAh"},
        ],
    },
    {
        "name": "Baseus Hub USB-C 11 en 1 65W",
        "slug": "baseus-65w-hub-usbc-11en1",
        "shortDescription": "Hub USB-C con HDMI 4K, 4×USB-A 3.0, 2×USB-C, lector SD/microSD, jack audio y carga pass-through 65 W.",
        "description": "El Baseus Hub 11 en 1 convierte un solo puerto USB-C en una completa estación de trabajo. Ideal para portátiles con pocos puertos como MacBook o ultrabooks. Soporta salida de vídeo HDMI 4K a 30 Hz, transferencia de datos USB-A 3.0 a 5 Gbps y carga pass-through de 65 W para mantener el portátil cargado mientras trabajas.",
        "price": 69,
        "stock": 55,
        "category": "accesorios",
        "specifications": [
            {"key": "Puertos", "value": "HDMI 4K + 4×USB-A 3.0 + 2×USB-C + SD + microSD + jack 3,5mm"},
            {"key": "Carga pass-through", "value": "65 W"},
            {"key": "Velocidad USB", "value": "5 Gbps"},
            {"key": "Salida vídeo", "value": "HDMI 4K 30Hz"},
            {"key": "Conexión host", "value": "USB-C"},
            {"key": "Longitud cable", "value": "15 cm"},
            {"key": "Compatibilidad", "value": "Windows / macOS / ChromeOS"},
        ],
    },

    # ── AUDIO ─────────────────────────────────────────────────────────────────
    {
        "name": "Bose QuietComfort Ultra Earbuds",
        "slug": "bose-quietcomfort-ultra-earbuds",
        "shortDescription": "TWS con la mejor ANC de su categoría, audio espacial inmersivo y hasta 6 horas de batería por carga.",
        "description": "Los Bose QuietComfort Ultra Earbuds llevan la cancelación de ruido activa a un nivel nunca visto en auriculares in-ear. La tecnología CustomTune analiza tu anatomía auricular en tiempo real y ajusta el sonido y el ANC para ti específicamente. El modo Immersive Audio crea una experiencia de sonido espacial que sitúa la música a tu alrededor.",
        "price": 299,
        "stock": 20,
        "category": "audio",
        "specifications": [
            {"key": "Tipo", "value": "TWS In-ear"},
            {"key": "ANC", "value": "Sí, adaptativa CustomTune"},
            {"key": "Audio espacial", "value": "Sí, Immersive Audio"},
            {"key": "Batería", "value": "6h + 18h con estuche"},
            {"key": "Resistencia", "value": "IPX4"},
            {"key": "Conexión", "value": "Bluetooth 5.3"},
            {"key": "Carga", "value": "USB-C / inalámbrica Qi"},
        ],
    },
    {
        "name": "Marshall Emberton III Bluetooth",
        "slug": "marshall-emberton-iii-bluetooth",
        "shortDescription": "Altavoz portátil con 30 horas de reproducción, resistencia IP67, sonido 360° y carga USB-C.",
        "description": "El Marshall Emberton III combina el icónico estilo rock de Marshall con una potencia sonora sorprendente para su tamaño. Sus 30 horas de batería lo convierten en el compañero perfecto para viajes y aventuras al aire libre. La certificación IP67 lo protege contra polvo y sumersión en agua hasta 1 metro durante 30 minutos.",
        "price": 149,
        "stock": 35,
        "category": "audio",
        "specifications": [
            {"key": "Tipo", "value": "Altavoz portátil"},
            {"key": "Potencia", "value": "10 W"},
            {"key": "Batería", "value": "30 horas"},
            {"key": "Resistencia", "value": "IP67"},
            {"key": "Sonido", "value": "360° True Stereophonic"},
            {"key": "Conexión", "value": "Bluetooth 5.3"},
            {"key": "Carga", "value": "USB-C"},
        ],
    },
    {
        "name": "Sennheiser Momentum 4 Wireless",
        "slug": "sennheiser-momentum-4-wireless",
        "shortDescription": "Auriculares over-ear con ANC adaptativa, 60 horas de batería, sonido Hi-Fi y plegables para viaje.",
        "description": "Los Sennheiser Momentum 4 Wireless representan la excelencia alemana en audio portátil. Con 60 horas de autonomía son los auriculares inalámbricos con más batería de su categoría premium. La ANC adaptativa ajusta el nivel de cancelación según el entorno, y el sonido Hi-Fi con transductores de 42 mm reproduce cada detalle musical con fidelidad absoluta.",
        "price": 349,
        "stock": 16,
        "category": "audio",
        "specifications": [
            {"key": "Tipo", "value": "Over-ear circum-aural"},
            {"key": "ANC", "value": "Sí, adaptativa"},
            {"key": "Batería", "value": "60 horas"},
            {"key": "Transductores", "value": "42 mm"},
            {"key": "Codec", "value": "aptX Adaptive / AAC / SBC"},
            {"key": "Conexión", "value": "Bluetooth 5.2"},
            {"key": "Plegable", "value": "Sí"},
        ],
    },
    {
        "name": "JBL Charge 6 Bluetooth",
        "slug": "jbl-charge-6-bluetooth",
        "shortDescription": "Altavoz portátil IP67 con 20 horas de batería, función power bank integrado y sonido potente con bajos profundos.",
        "description": "El JBL Charge 6 es el altavoz portátil más popular por una razón: ofrece el mejor equilibrio entre potencia sonora, autonomía y durabilidad. Su función de power bank permite cargar tu smartphone cuando más lo necesites. El sonido JBL Original Pro con dos radiadores pasivos produce bajos potentes que no esperarías de un altavoz de este tamaño.",
        "price": 189,
        "stock": 42,
        "category": "audio",
        "specifications": [
            {"key": "Tipo", "value": "Altavoz portátil"},
            {"key": "Potencia", "value": "20 W"},
            {"key": "Batería", "value": "20 horas"},
            {"key": "Resistencia", "value": "IP67"},
            {"key": "Power bank", "value": "Sí"},
            {"key": "Conexión", "value": "Bluetooth 5.3 + USB-C"},
            {"key": "PartyBoost", "value": "Sí"},
        ],
    },
    {
        "name": "Rode NT-USB Mini Micrófono",
        "slug": "rode-nt-usb-mini-microfono",
        "shortDescription": "Micrófono USB de condensador compacto para podcast, streaming y videollamadas con monitoreo sin latencia.",
        "description": "El Rode NT-USB Mini es el micrófono de referencia para creadores de contenido que buscan calidad de estudio en un formato compacto. La cápsula de condensador de alta calidad captura la voz con claridad y calidez natural. El monitoreo de auriculares sin latencia permite escucharte en tiempo real mientras grabas.",
        "price": 99,
        "stock": 30,
        "category": "audio",
        "specifications": [
            {"key": "Tipo", "value": "Condensador cardioide USB"},
            {"key": "Respuesta de frecuencia", "value": "20 Hz – 20 kHz"},
            {"key": "Conexión", "value": "USB-C"},
            {"key": "Monitoreo", "value": "Sin latencia (jack 3,5mm)"},
            {"key": "Soporte", "value": "Magnético desmontable"},
            {"key": "Compatibilidad", "value": "PC / Mac / iPad"},
            {"key": "Peso", "value": "95 g"},
        ],
    },

    # ── PORTÁTILES ────────────────────────────────────────────────────────────
    {
        "name": "Dell XPS 15 (2024) Core Ultra 7",
        "slug": "dell-xps-15-2024-core-ultra-7",
        "shortDescription": "Pantalla OLED 3,5K táctil 15,6\", Intel Core Ultra 7 155H, 32 GB LPDDR5 y 1 TB NVMe PCIe Gen 4.",
        "description": "El Dell XPS 15 es el portátil premium para profesionales creativos que no quieren renunciar a la portabilidad. La pantalla OLED de 3,5K con cobertura del 100% de DCI-P3 ofrece colores perfectos para edición de foto y vídeo. El Intel Core Ultra 7 con GPU Intel Arc integrada gestiona con fluidez cualquier tarea de productividad o creación de contenido.",
        "price": 1899,
        "stock": 8,
        "category": "portatiles",
        "specifications": [
            {"key": "Pantalla", "value": "15,6\" OLED 3,5K táctil 60Hz"},
            {"key": "Procesador", "value": "Intel Core Ultra 7 155H"},
            {"key": "RAM", "value": "32 GB LPDDR5"},
            {"key": "Almacenamiento", "value": "1 TB NVMe PCIe Gen 4"},
            {"key": "GPU", "value": "Intel Arc + NVIDIA RTX 4060"},
            {"key": "Batería", "value": "86 Wh, carga 130W"},
            {"key": "Sistema operativo", "value": "Windows 11 Pro"},
        ],
    },
    {
        "name": "Lenovo ThinkPad X1 Carbon Gen 12",
        "slug": "lenovo-thinkpad-x1-carbon-gen-12",
        "shortDescription": "Ultrabook 14\" IPS 2,8K, Intel Core Ultra 5 125U, 16 GB LPDDR5x y batería hasta 15 horas.",
        "description": "El ThinkPad X1 Carbon Gen 12 es el ultrabook empresarial de referencia desde hace más de una década. Con apenas 1,12 kg es uno de los portátiles de 14\" más ligeros del mercado sin sacrificar durabilidad militar MIL-STD-810H. El teclado ThinkPad sigue siendo el mejor de la industria para escritura prolongada.",
        "price": 1649,
        "stock": 10,
        "category": "portatiles",
        "specifications": [
            {"key": "Pantalla", "value": "14\" IPS 2,8K 120Hz"},
            {"key": "Procesador", "value": "Intel Core Ultra 5 125U"},
            {"key": "RAM", "value": "16 GB LPDDR5x"},
            {"key": "Almacenamiento", "value": "512 GB NVMe"},
            {"key": "Peso", "value": "1,12 kg"},
            {"key": "Batería", "value": "57 Wh, hasta 15 horas"},
            {"key": "Certificación", "value": "MIL-STD-810H"},
        ],
    },
    {
        "name": "HP Spectre x360 14 OLED",
        "slug": "hp-spectre-x360-14-oled",
        "shortDescription": "Convertible 2 en 1 con pantalla OLED 2,8K táctil, Intel Core Ultra 7, 32 GB y autonomía de 17 horas.",
        "description": "El HP Spectre x360 14 es el convertible más elegante del mercado, con un diseño bisagra de 360° que permite usarlo como portátil, tableta, tienda o caballete. La pantalla OLED táctil de 2,8K con IMAX Enhanced ofrece una experiencia visual excepcional. Incluye lápiz HP MPP 2.0 para notas y dibujo.",
        "price": 1599,
        "stock": 9,
        "category": "portatiles",
        "specifications": [
            {"key": "Pantalla", "value": "14\" OLED 2,8K táctil 120Hz"},
            {"key": "Procesador", "value": "Intel Core Ultra 7 155H"},
            {"key": "RAM", "value": "32 GB LPDDR5"},
            {"key": "Almacenamiento", "value": "1 TB NVMe"},
            {"key": "Formato", "value": "Convertible 360°"},
            {"key": "Batería", "value": "68 Wh, hasta 17 horas"},
            {"key": "Incluye", "value": "Lápiz HP MPP 2.0"},
        ],
    },
    {
        "name": "Acer Swift Go 16 OLED",
        "slug": "acer-swift-go-16-oled",
        "shortDescription": "Portátil ultradelgado con pantalla OLED 2,8K 120 Hz, Intel Core Ultra 5, 16 GB LPDDR5 y 1 TB NVMe.",
        "description": "El Acer Swift Go 16 democratiza las pantallas OLED en la gama media con su impresionante panel de 2,8K y 120 Hz. Con un precio muy competitivo para su especificación, es la opción ideal para estudiantes y profesionales que quieren calidad de imagen premium sin gastar una fortuna. Su chasis de aluminio es ligero y resistente.",
        "price": 1099,
        "stock": 14,
        "category": "portatiles",
        "specifications": [
            {"key": "Pantalla", "value": "16\" OLED 2,8K 120Hz"},
            {"key": "Procesador", "value": "Intel Core Ultra 5 125H"},
            {"key": "RAM", "value": "16 GB LPDDR5"},
            {"key": "Almacenamiento", "value": "1 TB NVMe PCIe 4"},
            {"key": "GPU", "value": "Intel Arc integrada"},
            {"key": "Batería", "value": "75 Wh, carga 65W USB-C"},
            {"key": "Peso", "value": "1,75 kg"},
        ],
    },
    {
        "name": "LG Gram Pro 17 (2024)",
        "slug": "lg-gram-pro-17-2024",
        "shortDescription": "Portátil 17\" con solo 1350 g de peso, Intel Core Ultra 7, 32 GB LPDDR5 y hasta 18 horas de autonomía.",
        "description": "El LG Gram Pro 17 desafía las leyes de la física ofreciendo una pantalla de 17 pulgadas en un cuerpo que pesa menos de 1,4 kg. Certificado MIL-STD-810H en 7 categorías, es increíblemente resistente pese a su ligereza. La pantalla IPS WQXGA anti-reflejos es perfecta para trabajar con hojas de cálculo, código o documentos largos.",
        "price": 1799,
        "stock": 8,
        "category": "portatiles",
        "specifications": [
            {"key": "Pantalla", "value": "17\" IPS WQXGA 2560×1600 60Hz"},
            {"key": "Procesador", "value": "Intel Core Ultra 7 155H"},
            {"key": "RAM", "value": "32 GB LPDDR5"},
            {"key": "Almacenamiento", "value": "1 TB NVMe"},
            {"key": "Peso", "value": "1350 g"},
            {"key": "Batería", "value": "80 Wh, hasta 18 horas"},
            {"key": "Certificación", "value": "MIL-STD-810H (7 categorías)"},
        ],
    },

    # ── GAMING ────────────────────────────────────────────────────────────────
    {
        "name": "NVIDIA GeForce RTX 4070 Super 12GB",
        "slug": "nvidia-geforce-rtx-4070-super-12gb",
        "shortDescription": "7168 núcleos CUDA, DLSS 3.5 Frame Generation y ray tracing en 1440p a más de 144 FPS.",
        "description": "La RTX 4070 Super es la tarjeta gráfica con mejor relación rendimiento/precio para gaming en 1440p. Con DLSS 3.5 y Frame Generation puede multiplicar los FPS en títulos compatibles, y el ray tracing en tiempo real ofrece iluminación fotorrealista. Los 12 GB de VRAM GDDR6X aseguran compatibilidad con los juegos más exigentes de los próximos años.",
        "price": 599,
        "stock": 15,
        "category": "gaming",
        "specifications": [
            {"key": "Núcleos CUDA", "value": "7168"},
            {"key": "VRAM", "value": "12 GB GDDR6X"},
            {"key": "Velocidad boost", "value": "2,52 GHz"},
            {"key": "TDP", "value": "220 W"},
            {"key": "Salidas", "value": "3× DisplayPort 1.4a + 1× HDMI 2.1"},
            {"key": "DLSS", "value": "3.5 con Frame Generation"},
            {"key": "Ray Tracing", "value": "Sí, 3ª generación"},
        ],
    },
    {
        "name": "PlayStation 5 Slim Disc Edition",
        "slug": "playstation-5-slim-disc-edition",
        "shortDescription": "Consola PS5 rediseñada más compacta, lector de disco, SSD 1 TB y soporte para juegos 4K a 120 fps.",
        "description": "La PS5 Slim mantiene toda la potencia de la PlayStation 5 original en un cuerpo un 30% más pequeño y ligero. El SSD personalizado de 1 TB ofrece tiempos de carga casi instantáneos, y el soporte para 4K a 120 fps y ray tracing garantiza la experiencia visual más impresionante en consola.",
        "price": 449,
        "stock": 20,
        "category": "gaming",
        "specifications": [
            {"key": "CPU", "value": "AMD Zen 2 8 núcleos 3,5 GHz"},
            {"key": "GPU", "value": "AMD RDNA 2, 10,3 TFLOPs"},
            {"key": "RAM", "value": "16 GB GDDR6"},
            {"key": "Almacenamiento", "value": "SSD 1 TB personalizado"},
            {"key": "Resolución máx.", "value": "4K 120fps"},
            {"key": "Ray Tracing", "value": "Sí"},
            {"key": "Lector", "value": "Ultra HD Blu-ray"},
        ],
    },
    {
        "name": "Xbox Series X 1TB",
        "slug": "xbox-series-x-1tb",
        "shortDescription": "Consola 4K a 120 fps, SSD NVMe 1 TB, retrocompatibilidad total y acceso al catálogo Game Pass.",
        "description": "La Xbox Series X es la consola más potente del mercado con 12 teraflops de potencia gráfica. La retrocompatibilidad total con juegos de Xbox One, 360 y la Xbox original significa que tu biblioteca entera sigue funcionando, muchas veces a mejor resolución y framerate. El Game Pass Ultimate da acceso a cientos de juegos por suscripción.",
        "price": 499,
        "stock": 18,
        "category": "gaming",
        "specifications": [
            {"key": "CPU", "value": "AMD Zen 2 8 núcleos 3,8 GHz"},
            {"key": "GPU", "value": "AMD RDNA 2, 12 TFLOPs"},
            {"key": "RAM", "value": "16 GB GDDR6"},
            {"key": "Almacenamiento", "value": "SSD NVMe 1 TB"},
            {"key": "Resolución máx.", "value": "4K 120fps"},
            {"key": "Retrocompatibilidad", "value": "Xbox / 360 / One / Series"},
            {"key": "Game Pass", "value": "Compatible"},
        ],
    },
    {
        "name": "SteelSeries Arctis Nova Pro Wireless",
        "slug": "steelseries-arctis-nova-pro-wireless",
        "shortDescription": "Auriculares gaming inalámbricos con ANC activa, sistema de batería intercambiable y sonar espacial para PC y consola.",
        "description": "Los SteelSeries Arctis Nova Pro Wireless son los auriculares gaming más avanzados del mercado. Su sistema de doble batería intercambiable elimina para siempre los cortes por batería agotada. La ANC activa permite concentrarse durante sesiones largas, y el sonar espacial Tempest 3D coloca cada sonido con precisión milimétrica.",
        "price": 349,
        "stock": 16,
        "category": "gaming",
        "specifications": [
            {"key": "Tipo", "value": "Over-ear inalámbrico"},
            {"key": "ANC", "value": "Sí, activa"},
            {"key": "Batería", "value": "Sistema intercambiable (22h + 22h)"},
            {"key": "Conexión", "value": "2,4 GHz + Bluetooth"},
            {"key": "Compatibilidad", "value": "PC / PS5 / PS4 / Switch"},
            {"key": "Sonar espacial", "value": "Sí, Tempest 3D"},
            {"key": "Base de carga", "value": "Incluida con puerto USB-C"},
        ],
    },
    {
        "name": "Elgato 4K X Tarjeta de Captura",
        "slug": "elgato-4k-x-tarjeta-captura",
        "shortDescription": "Captura externa 4K 60fps con HDR10, latencia ultrabaja para streaming en vivo desde PS5, Xbox y PC.",
        "description": "La Elgato 4K X es la tarjeta de captura más avanzada de Elgato, diseñada para creadores de contenido que exigen lo mejor. Captura vídeo 4K a 60 fps con HDR10 sin comprimir para obtener grabaciones de máxima calidad. El modo de paso directo 4K 144 Hz permite jugar a máximo rendimiento mientras grabas simultáneamente.",
        "price": 199,
        "stock": 22,
        "category": "gaming",
        "specifications": [
            {"key": "Captura", "value": "4K 60fps HDR10"},
            {"key": "Paso directo", "value": "4K 144Hz"},
            {"key": "Conexión host", "value": "USB-C 3.1"},
            {"key": "Entrada/Salida", "value": "HDMI 2.1"},
            {"key": "Latencia", "value": "Ultrabaja"},
            {"key": "Software", "value": "OBS / Streamlabs / 4K Capture Utility"},
            {"key": "Compatibilidad", "value": "PS5 / Xbox Series X / PC"},
        ],
    },
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def headers():
    h = {"Content-Type": "application/json"}
    if STRAPI_TOKEN:
        h["Authorization"] = f"Bearer {STRAPI_TOKEN}"
    return h

def get_category_id(slug: str, cache: dict) -> int | None:
    if slug in cache:
        return cache[slug]
    res = requests.get(
        f"{STRAPI_URL}/api/categories?filters[slug][$eq]={slug}",
        headers=headers(), timeout=15
    )
    res.raise_for_status()
    data = res.json().get("data", [])
    cat_id = data[0]["id"] if data else None
    if not cat_id:
        print(f"  ⚠️  Categoría '{slug}' no encontrada en Strapi")
    cache[slug] = cat_id
    return cat_id

def product_exists(slug: str) -> bool:
    res = requests.get(
        f"{STRAPI_URL}/api/products?filters[slug][$eq]={slug}",
        headers=headers(), timeout=15
    )
    res.raise_for_status()
    return len(res.json().get("data", [])) > 0

def create_product(p: dict, cat_id: int | None) -> bool:
    payload = {
        "data": {
            "name":             p["name"],
            "slug":             p["slug"],
            "shortDescription": p["shortDescription"],
            "description":      [{"type": "paragraph", "children": [{"type": "text", "text": p["description"]}]}],
            "price":            p["price"],
            "stock":            p["stock"],
            "specifications":   p["specifications"],
        }
    }
    if cat_id:
        payload["data"]["category"] = cat_id

    res = requests.post(
        f"{STRAPI_URL}/api/products",
        json=payload, headers=headers(), timeout=30
    )
    if res.status_code in (200, 201):
        return True
    print(f"  ✗ {res.status_code} — {res.text[:300]}")
    return False

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    total = len(PRODUCTOS)
    print(f"\n{'='*55}")
    print(f"  ZetaGadget — Subiendo {total} productos (sin imágenes)")
    print(f"{'='*55}\n")

    cat_cache: dict = {}
    ok = skip = fail = 0

    for i, p in enumerate(PRODUCTOS, 1):
        print(f"[{i:02d}/{total}] {p['name']}")

        if product_exists(p["slug"]):
            print("  → Ya existe, omitiendo.\n")
            skip += 1
            continue

        cat_id = get_category_id(p["category"], cat_cache)

        if create_product(p, cat_id):
            print("  ✓ Creado.\n")
            ok += 1
        else:
            fail += 1
            print()

    print(f"{'='*55}")
    print(f"  ✓ Creados : {ok}")
    print(f"  ↷ Omitidos: {skip}")
    print(f"  ✗ Errores : {fail}")
    print(f"{'='*55}\n")

    if fail:
        sys.exit(1)

if __name__ == "__main__":
    main()
