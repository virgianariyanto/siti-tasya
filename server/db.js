import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/siti_tasya_db'

const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1')

export const pool = new Pool({
  connectionString,
  ssl: !isLocalhost ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Auto Migration & Seed Function
export async function initDatabase() {
  const client = await pool.connect()
  try {
    console.log('🔄 Menghubungkan ke PostgreSQL & menjalankan migrasi...')

    // 1. Admin Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        secondary_email VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        title VARCHAR(255),
        avatar VARCHAR(50),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Seed default admin if empty
    const adminCheck = await client.query('SELECT * FROM admin_users LIMIT 1;')
    if (adminCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO admin_users (email, secondary_email, password, name, role, title, avatar)
        VALUES ('admin@sititasya.com', 'siti.tasya@studio.com', 'admin123', 'Siti Tasya', 'admin', 'Principal Illustrator & Studio Owner', '🎨');
      `)
      console.log('✅ Admin default user berhasil di-seed.');
    }

    // 2. Site Content Table (Key-Value JSONB)
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        section_key VARCHAR(100) PRIMARY KEY,
        content JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Seed default content sections if empty
    const contentCheck = await client.query('SELECT section_key FROM site_content;')
    const existingKeys = contentCheck.rows.map((r) => r.section_key)

    if (!existingKeys.includes('hero')) {
      await client.query(
        `INSERT INTO site_content (section_key, content) VALUES ($1, $2);`,
        [
          'hero',
          JSON.stringify({
            statusBadge: 'AVAILABLE FOR FREELANCE',
            titleName: 'Siti Tasya',
            titleRole: 'Illustrator',
            titleCity: 'Bekasi',
            titleCountry: 'Indonesia',
            subtitle:
              "Creating magical worlds and gentle characters for children's stories. I turn daydreams into tactile digital art with a heart.",
            btn1Text: 'View My Work',
            btn1Link: '#work',
            btn2Text: 'Hire Me',
            btn2Link: '#contact',
            stat1Value: '50+',
            stat1Label: 'Books Illustrated',
            stat2Value: '120+',
            stat2Label: 'Character Designs',
            imageUrl: '/images/hero_illustration.png',
            imageAlt: 'Whimsical Hero Illustration',
          }),
        ]
      )
    }

    if (!existingKeys.includes('about')) {
      await client.query(
        `INSERT INTO site_content (section_key, content) VALUES ($1, $2);`,
        [
          'about',
          JSON.stringify({
            headlinePart1: 'A bit',
            headlinePart2: 'about',
            headlinePart3: 'my',
            headlinePart4: 'world...',
            paragraph1:
              "Hello! I'm Siti, a visual storyteller specialized in children's book illustration and character design. Living in the vibrant city of Bekasi, I draw inspiration from both urban hustle and the quiet moments of imagination.",
            paragraph2:
              'My work is characterized by organic textures, warm palettes, and a sense of wonder. I believe every character has a secret story waiting to be told through a single brushstroke.',
            avatarUrl: '/images/artist_avatar.png',
            avatarAlt: 'Siti Tasya Avatar',
            toolboxLabel: 'MY TOOLBOX:',
            toolboxIcons: [
              { id: 't1', icon: 'photo_library', name: 'Photoshop' },
              { id: 't2', icon: 'format_paint', name: 'Procreate' },
              { id: 't3', icon: 'brush', name: 'Traditional Inks' },
            ],
          }),
        ]
      )
    }

    if (!existingKeys.includes('contact')) {
      await client.query(
        `INSERT INTO site_content (section_key, content) VALUES ($1, $2);`,
        [
          'contact',
          JSON.stringify({
            sectionTitle: "Let's create something magical together",
            sectionSubtitle:
              'Whether you have a book idea, a brand project, or just want to say hi, my inbox is always open for new adventures.',
            email: 'hello@sititasya.com',
            location: 'Bekasi, Indonesia',
            socialLinks: [
              { id: 's1', name: 'LinkedIn', label: 'In', url: 'https://linkedin.com' },
              { id: 's2', name: 'Instagram', label: 'Ig', url: 'https://instagram.com' },
              { id: 's3', name: 'Behance', label: 'Be', url: 'https://behance.net' },
            ],
          }),
        ]
      )
    }

    if (!existingKeys.includes('footer')) {
      await client.query(
        `INSERT INTO site_content (section_key, content) VALUES ($1, $2);`,
        [
          'footer',
          JSON.stringify({
            brandName: 'Siti Tasya',
            copyright: '© 2024 Siti Tasya. Hand-drawn with love in Bekasi.',
            craftBadge: 'Crafted with magic',
            footerLinks: [
              { id: 'f1', label: 'Instagram', url: '#' },
              { id: 'f2', label: 'Twitter', url: '#' },
              { id: 'f3', label: 'Behance', url: '#' },
              { id: 'f4', label: 'Email', url: 'mailto:hello@sititasya.com' },
            ],
          }),
        ]
      )
    }

    // 3. Services Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(100) PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price VARCHAR(100) NOT NULL,
        icon_color VARCHAR(100),
        bg_color VARCHAR(100),
        hover_shadow VARCHAR(100),
        rotation VARCHAR(100),
        offset_class VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const servicesCheck = await client.query('SELECT COUNT(*) FROM services;')
    if (parseInt(servicesCheck.rows[0].count, 10) === 0) {
      const defaultServices = [
        {
          id: 'srv-1',
          icon: 'menu_book',
          title: "Children's Books",
          description: 'Full-page spreads and covers that spark childhood imagination and wonder.',
          price: 'FROM $1,000+',
          icon_color: 'text-secondary',
          bg_color: 'bg-secondary-container/40',
          hover_shadow: 'hover:shadow-secondary/10',
          rotation: 'group-hover:rotate-6',
          offset_class: '',
        },
        {
          id: 'srv-2',
          icon: 'face_6',
          title: 'Character Design',
          description: 'Developing unique personalities and expressive visual identities for stories.',
          price: 'FROM $350+',
          icon_color: 'text-primary',
          bg_color: 'bg-primary-fixed/40',
          hover_shadow: 'hover:shadow-primary/10',
          rotation: 'group-hover:-rotate-6',
          offset_class: 'lg:translate-y-8',
        },
        {
          id: 'srv-3',
          icon: 'palette',
          title: 'Brand Illustration',
          description: 'Custom illustrations to give your brand a human, friendly, and organic feel.',
          price: 'FROM $500+',
          icon_color: 'text-tertiary',
          bg_color: 'bg-tertiary-fixed/40',
          hover_shadow: 'hover:shadow-tertiary/10',
          rotation: 'group-hover:rotate-6',
          offset_class: '',
        },
        {
          id: 'srv-4',
          icon: 'frame_person',
          title: 'Poster Art',
          description: 'Limited edition prints and decorative botanical wall art for collectors.',
          price: 'FROM $200+',
          icon_color: 'text-outline',
          bg_color: 'bg-surface-container-highest',
          hover_shadow: 'hover:shadow-outline/10',
          rotation: 'group-hover:-rotate-6',
          offset_class: 'lg:translate-y-8',
        },
      ]

      for (const s of defaultServices) {
        await client.query(
          `INSERT INTO services (id, icon, title, description, price, icon_color, bg_color, hover_shadow, rotation, offset_class)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
          [s.id, s.icon, s.title, s.description, s.price, s.icon_color, s.bg_color, s.hover_shadow, s.rotation, s.offset_class]
        )
      }
      console.log('✅ Services default berhasil di-seed.');
    }

    // 4. Gallery Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category_tag VARCHAR(100) NOT NULL,
        category_key VARCHAR(100) NOT NULL,
        img_src TEXT NOT NULL,
        alt TEXT,
        extra_classes VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const galleryCheck = await client.query('SELECT COUNT(*) FROM gallery_items;')
    if (parseInt(galleryCheck.rows[0].count, 10) === 0) {
      const defaultGallery = [
        {
          id: 'gal-1',
          title: "The Fox's Secret",
          category_tag: 'Book Illustration',
          category_key: 'Books',
          img_src: '/images/fox_secret_illustration.png',
          alt: "A soft whimsical illustration for a children's book featuring a little girl whispering secrets to a giant, friendly fox in a moonlit forest.",
          extra_classes: '',
        },
        {
          id: 'gal-2',
          title: "Chef Mimi's Bakery",
          category_tag: 'Character Design',
          category_key: 'Characters',
          img_src: '/images/chef_mimi_character.png',
          alt: 'A character design sheet for a whimsical baker character with flour on her apron and a friendly smile.',
          extra_classes: '',
        },
        {
          id: 'gal-3',
          title: 'Under the Toadstool',
          category_tag: "Children's Book",
          category_key: 'Books',
          img_src: '/images/mushroom_tea_party.png',
          alt: 'A detailed children\'s book illustration showing a tea party under a giant mushroom.',
          extra_classes: 'lg:mt-12',
        },
        {
          id: 'gal-4',
          title: 'Golden Nectar',
          category_tag: 'Branding',
          category_key: 'Packaging',
          img_src: '/images/honey_packaging_design.png',
          alt: 'A packaging design for a whimsical organic honey brand.',
          extra_classes: '',
        },
        {
          id: 'gal-5',
          title: 'Tropical Botanica',
          category_tag: 'Poster Art',
          category_key: 'Packaging',
          img_src: '/images/tropical_botanica_poster.png',
          alt: 'A poster art piece featuring a collection of whimsical Indonesian botanicals.',
          extra_classes: 'lg:-mt-24',
        },
      ]

      for (const g of defaultGallery) {
        await client.query(
          `INSERT INTO gallery_items (id, title, category_tag, category_key, img_src, alt, extra_classes)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [g.id, g.title, g.category_tag, g.category_key, g.img_src, g.alt, g.extra_classes]
        )
      }
      console.log('✅ Gallery items default berhasil di-seed.');
    }

    // 5. Testimonials Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(100) PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        quote TEXT NOT NULL,
        bg_color VARCHAR(100),
        transform VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const testCheck = await client.query('SELECT COUNT(*) FROM testimonials;')
    if (parseInt(testCheck.rows[0].count, 10) === 0) {
      const defaultTestimonials = [
        {
          id: 'test-1',
          quote:
            '"Siti didn\'t just illustrate my book; she breathed a soul into the characters. Her attention to detail and ability to capture emotion through color is truly magical."',
          author: 'Elena R.',
          role: 'Author, UK',
          bg_color: 'bg-secondary-fixed-dim',
          transform: 'transform -rotate-1',
        },
        {
          id: 'test-2',
          quote:
            '"Working with Siti on our branding was a dream. She captured the handmade, organic feel we wanted perfectly. Our customers love her illustrations!"',
          author: 'Mark J.',
          role: 'Tea & Co Founder',
          bg_color: 'bg-primary-fixed-dim',
          transform: 'transform rotate-2 lg:translate-y-6',
        },
        {
          id: 'test-3',
          quote:
            '"Professional, imaginative, and incredibly talented. Siti delivered more than what was briefed. She is now our go-to illustrator for all poster art."',
          author: 'Siska K.',
          role: 'Event Organizer',
          bg_color: 'bg-tertiary-fixed',
          transform: 'transform -rotate-1 md:hidden lg:block',
        },
      ]

      for (const t of defaultTestimonials) {
        await client.query(
          `INSERT INTO testimonials (id, author, role, quote, bg_color, transform)
           VALUES ($1, $2, $3, $4, $5, $6);`,
          [t.id, t.author, t.role, t.quote, t.bg_color, t.transform]
        )
      }
      console.log('✅ Testimonials default berhasil di-seed.');
    }

    // 6. Commissions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS commissions (
        id VARCHAR(100) PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_company VARCHAR(255),
        client_email VARCHAR(255),
        project_title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        budget VARCHAR(100),
        deadline VARCHAR(100),
        status VARCHAR(100),
        progress INT DEFAULT 0,
        deliverables TEXT,
        notes TEXT,
        updated_at VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const comCheck = await client.query('SELECT COUNT(*) FROM commissions;')
    if (parseInt(comCheck.rows[0].count, 10) === 0) {
      const defaultCommissions = [
        {
          id: 'COM-2024-001',
          client_name: 'Sarah Jenkins',
          client_company: 'Bintang Story Books',
          client_email: 'sarah.j@bintangbooks.id',
          project_title: 'Buku Cerita "Petualangan Kiki si Kancil Cilik"',
          category: 'Children Book',
          budget: 'Rp 14.500.000',
          deadline: '15 Sep 2026',
          status: 'In Progress (Pewarnaan)',
          progress: 70,
          deliverables: '18 Ilustrasi Halaman Penuh + Sampul Hardcover',
          notes: 'Karakter utama butuh sedikit penyesuaian warna rompi agar lebih cerah.',
          updated_at: '24 Agt 2026',
        },
        {
          id: 'COM-2024-002',
          client_name: 'Arif Wicaksono',
          client_company: 'Pustaka Ceria Nusantara',
          client_email: 'arif@pustakaceria.com',
          project_title: 'Kumpulan Fabel Nusantara: Satwa Hutan Mistis',
          category: 'Editorial & Cover',
          budget: 'Rp 9.200.000',
          deadline: '28 Sep 2026',
          status: 'Sketsa Kasar',
          progress: 35,
          deliverables: '8 Ilustrasi Double-Spread + Spot Art',
          notes: 'Menunggu persetujuan sketsa konsep burung kasuari ajaib.',
          updated_at: '22 Agt 2026',
        },
        {
          id: 'COM-2024-003',
          client_name: 'Nadia Rahma',
          client_company: 'Studio Kelinci Kecil Merch',
          client_email: 'nadia@kelincikecil.store',
          project_title: 'Stiker Pack & Enamel Pin "Fauna Lucu Tropis"',
          category: 'Merchandise Design',
          budget: 'Rp 6.000.000',
          deadline: '05 Okt 2026',
          status: 'Briefing',
          progress: 15,
          deliverables: '12 Vektor Desain Karakter + Mockup Produk',
          notes: 'Klien mengirim moodboard palet warna pastel hangat.',
          updated_at: '20 Agt 2026',
        },
        {
          id: 'COM-2024-004',
          client_name: 'David Haryanto',
          client_company: 'EduKids App',
          client_email: 'david@edukids.io',
          project_title: 'Ilustrasi Interaktif Edukasi Angka & Huruf',
          category: 'Digital Illustration',
          budget: 'Rp 18.000.000',
          deadline: '10 Agt 2026',
          status: 'Selesai',
          progress: 100,
          deliverables: '26 Ilustrasi Alfabet + File Master SVG/PNG',
          notes: 'Proyek selesai & pembayaran termin lunas.',
          updated_at: '12 Agt 2026',
        },
      ]

      for (const c of defaultCommissions) {
        await client.query(
          `INSERT INTO commissions (id, client_name, client_company, client_email, project_title, category, budget, deadline, status, progress, deliverables, notes, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
          [c.id, c.client_name, c.client_company, c.client_email, c.project_title, c.category, c.budget, c.deadline, c.status, c.progress, c.deliverables, c.notes, c.updated_at]
        )
      }
      console.log('✅ Commissions default berhasil di-seed.');
    }

    // 7. Inquiries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        service VARCHAR(255),
        budget_range VARCHAR(100),
        message TEXT NOT NULL,
        date VARCHAR(100),
        is_read BOOLEAN DEFAULT false,
        status VARCHAR(100) DEFAULT 'Menunggu Balasan',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const inqCheck = await client.query('SELECT COUNT(*) FROM inquiries;')
    if (parseInt(inqCheck.rows[0].count, 10) === 0) {
      const defaultInquiries = [
        {
          id: 'INQ-101',
          name: 'Maya Kusuma',
          email: 'maya.kusuma@literasipopuler.id',
          service: 'Children Book Series',
          budget_range: 'Rp 10.000.000 - Rp 20.000.000',
          message:
            'Halo Siti Tasya! Kami berencana menerbitkan seri 3 buku cerita anak tentang emosi dan empati. Kami sangat menyukai gaya ilustrasi buku Anda yang bernuansa hangat dan penuh cerita. Bisakah kita berdiskusi jadwal untuk Q4?',
          date: '23 Agt 2026',
          is_read: false,
          status: 'Menunggu Balasan',
        },
        {
          id: 'INQ-102',
          name: 'Rian Pratama',
          email: 'rian@brandkopi.co.id',
          service: 'Packaging & Mascot',
          budget_range: 'Rp 5.000.000 - Rp 10.000.000',
          message:
            'Kami membutuhkan ilustrasi maskot tupai kopi untuk packaging biji kopi edisi liburan akhir tahun. Gaya yang diinginkan whimsical line-art dengan aksen watercolor.',
          date: '21 Agt 2026',
          is_read: true,
          status: 'Sudah Dibalas',
        },
      ]

      for (const i of defaultInquiries) {
        await client.query(
          `INSERT INTO inquiries (id, name, email, service, budget_range, message, date, is_read, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
          [i.id, i.name, i.email, i.service, i.budget_range, i.message, i.date, i.is_read, i.status]
        )
      }
      console.log('✅ Inquiries default berhasil di-seed.');
    }

    // 8. Studio Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS studio_settings (
        id INT PRIMARY KEY DEFAULT 1,
        is_open_for_commissions BOOLEAN DEFAULT true,
        current_slot VARCHAR(255),
        status_notice TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const studioCheck = await client.query('SELECT * FROM studio_settings WHERE id = 1;')
    if (studioCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO studio_settings (id, is_open_for_commissions, current_slot, status_notice)
        VALUES (1, true, '2 Slot Tersedia untuk Q4 2026', 'Menerima pesanan ilustrasi buku anak dan desain karakter komersial.');
      `)
      console.log('✅ Studio settings default berhasil di-seed.');
    }

    console.log('🎉 Migrasi dan Seeding PostgreSQL berhasil 100%!')
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat inisialisasi database:', err)
  } finally {
    client.release()
  }
}
