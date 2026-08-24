import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool, initDatabase } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Initialize Database on server start
initDatabase().catch((err) => {
  console.error('Database initialization error:', err)
})

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as db_time;')
    res.json({ status: 'ok', database: 'connected', db_time: result.rows[0].db_time })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// ==================== AUTH APIS ====================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const cleanEmail = email?.trim().toLowerCase()
    const result = await pool.query(
      `SELECT * FROM admin_users 
       WHERE (LOWER(email) = $1 OR LOWER(secondary_email) = $1) AND password = $2;`,
      [cleanEmail, password]
    )

    if (result.rows.length > 0) {
      const user = result.rows[0]
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          avatar: user.avatar,
          loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      })
    } else {
      return res.status(401).json({
        success: false,
        message: 'Email atau kata sandi admin salah. Silakan periksa kembali kredensial Anda.',
      })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

app.post('/api/auth/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body
  try {
    const check = await pool.query('SELECT * FROM admin_users WHERE password = $1 LIMIT 1;', [currentPassword])
    if (check.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Kata sandi saat ini tidak cocok.' })
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 6 karakter.' })
    }

    await pool.query('UPDATE admin_users SET password = $1, updated_at = NOW();', [newPassword])
    res.json({ success: true, message: 'Kata sandi admin berhasil diperbarui!' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ==================== CONTENT APIS ====================
app.get('/api/content', async (req, res) => {
  try {
    const result = await pool.query('SELECT section_key, content FROM site_content;')
    const content = {}
    result.rows.forEach((row) => {
      content[row.section_key] = row.content
    })
    res.json(content)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/content/:section', async (req, res) => {
  const { section } = req.params
  const newContent = req.body
  try {
    await pool.query(
      `INSERT INTO site_content (section_key, content, updated_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (section_key) 
       DO UPDATE SET content = $2, updated_at = NOW();`,
      [section, JSON.stringify(newContent)]
    )
    res.json({ success: true, section, content: newContent })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ==================== SERVICES APIS ====================
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY created_at ASC;')
    const services = result.rows.map((row) => ({
      id: row.id,
      icon: row.icon,
      title: row.title,
      description: row.description,
      price: row.price,
      iconColor: row.icon_color,
      bgColor: row.bg_color,
      hoverShadow: row.hover_shadow,
      rotation: row.rotation,
      offset: row.offset_class,
    }))
    res.json(services)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/services', async (req, res) => {
  const s = req.body
  const id = s.id || `srv-${Date.now()}`
  try {
    await pool.query(
      `INSERT INTO services (id, icon, title, description, price, icon_color, bg_color, hover_shadow, rotation, offset_class)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
      [
        id,
        s.icon || 'palette',
        s.title,
        s.description || '',
        s.price || '',
        s.iconColor || 'text-primary',
        s.bgColor || 'bg-secondary-container/40',
        s.hoverShadow || 'hover:shadow-primary/10',
        s.rotation || 'group-hover:rotate-6',
        s.offset || '',
      ]
    )
    res.status(201).json({ id, ...s })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/services/:id', async (req, res) => {
  const { id } = req.params
  const s = req.body
  try {
    await pool.query(
      `UPDATE services 
       SET icon = $1, title = $2, description = $3, price = $4, icon_color = $5, bg_color = $6
       WHERE id = $7;`,
      [s.icon, s.title, s.description, s.price, s.iconColor, s.bgColor, id]
    )
    res.json({ success: true, id, ...s })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/services/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM services WHERE id = $1;', [id])
    res.json({ success: true, message: 'Layanan berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==================== GALLERY APIS ====================
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_items ORDER BY created_at DESC;')
    const items = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      categoryTag: row.category_tag,
      categoryKey: row.category_key,
      imgSrc: row.img_src,
      alt: row.alt,
      extraClasses: row.extra_classes || '',
    }))
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/gallery', async (req, res) => {
  const g = req.body
  const id = g.id || `gal-${Date.now()}`
  try {
    await pool.query(
      `INSERT INTO gallery_items (id, title, category_tag, category_key, img_src, alt, extra_classes)
       VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [id, g.title, g.categoryTag || 'Book Illustration', g.categoryKey || 'Books', g.imgSrc, g.alt || '', g.extraClasses || '']
    )
    res.status(201).json({ id, ...g })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/gallery/:id', async (req, res) => {
  const { id } = req.params
  const g = req.body
  try {
    await pool.query(
      `UPDATE gallery_items 
       SET title = $1, category_tag = $2, category_key = $3, img_src = $4, alt = $5
       WHERE id = $6;`,
      [g.title, g.categoryTag, g.categoryKey, g.imgSrc, g.alt, id]
    )
    res.json({ success: true, id, ...g })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/gallery/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM gallery_items WHERE id = $1;', [id])
    res.json({ success: true, message: 'Karya berhasil dihapus dari galeri' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==================== TESTIMONIALS APIS ====================
app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at ASC;')
    const items = result.rows.map((row) => ({
      id: row.id,
      author: row.author,
      role: row.role,
      quote: row.quote,
      bgColor: row.bg_color,
      transform: row.transform,
    }))
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/testimonials', async (req, res) => {
  const t = req.body
  const id = t.id || `test-${Date.now()}`
  try {
    await pool.query(
      `INSERT INTO testimonials (id, author, role, quote, bg_color, transform)
       VALUES ($1, $2, $3, $4, $5, $6);`,
      [id, t.author, t.role, t.quote, t.bgColor || 'bg-secondary-fixed-dim', t.transform || 'transform -rotate-1']
    )
    res.status(201).json({ id, ...t })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params
  const t = req.body
  try {
    await pool.query(
      `UPDATE testimonials 
       SET author = $1, role = $2, quote = $3, bg_color = $4
       WHERE id = $5;`,
      [t.author, t.role, t.quote, t.bgColor, id]
    )
    res.json({ success: true, id, ...t })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1;', [id])
    res.json({ success: true, message: 'Testimoni berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==================== COMMISSIONS APIS ====================
app.get('/api/commissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM commissions ORDER BY created_at DESC;')
    const items = result.rows.map((row) => ({
      id: row.id,
      clientName: row.client_name,
      clientCompany: row.client_company,
      clientEmail: row.client_email,
      projectTitle: row.project_title,
      category: row.category,
      budget: row.budget,
      deadline: row.deadline,
      status: row.status,
      progress: row.progress,
      deliverables: row.deliverables,
      notes: row.notes,
      updatedAt: row.updated_at,
    }))
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/commissions', async (req, res) => {
  const c = req.body
  const count = await pool.query('SELECT COUNT(*) FROM commissions;')
  const id = c.id || `COM-${new Date().getFullYear()}-${String(parseInt(count.rows[0].count, 10) + 1).padStart(3, '0')}`
  const updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  try {
    await pool.query(
      `INSERT INTO commissions (id, client_name, client_company, client_email, project_title, category, budget, deadline, status, progress, deliverables, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
      [id, c.clientName, c.clientCompany || '', c.clientEmail || '', c.projectTitle, c.category || 'Children Book', c.budget || '', c.deadline || '', c.status || 'Briefing', c.progress || 15, c.deliverables || '', c.notes || '', updatedAt]
    )
    res.status(201).json({ id, updatedAt, ...c })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/commissions/:id', async (req, res) => {
  const { id } = req.params
  const c = req.body
  const updatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  try {
    await pool.query(
      `UPDATE commissions 
       SET status = COALESCE($1, status), progress = COALESCE($2, progress), notes = COALESCE($3, notes), updated_at = $4
       WHERE id = $5;`,
      [c.status, c.progress, c.notes, updatedAt, id]
    )
    res.json({ success: true, id, ...c, updatedAt })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/commissions/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM commissions WHERE id = $1;', [id])
    res.json({ success: true, message: 'Proyek komisi berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==================== INQUIRIES APIS ====================
app.get('/api/inquiries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC;')
    const items = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      service: row.service,
      budgetRange: row.budget_range,
      message: row.message,
      date: row.date,
      isRead: row.is_read,
      status: row.status,
    }))
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/inquiries', async (req, res) => {
  const i = req.body
  const id = `INQ-${Date.now().toString().slice(-4)}`
  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  try {
    await pool.query(
      `INSERT INTO inquiries (id, name, email, service, budget_range, message, date, is_read, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [id, i.name, i.email, i.service || 'Children Book Series', i.budgetRange || 'Menyesuaikan Diskusi', i.message, date, false, 'Menunggu Balasan']
    )
    res.status(201).json({ id, date, isRead: false, status: 'Menunggu Balasan', ...i })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/inquiries/:id/toggle', async (req, res) => {
  const { id } = req.params
  try {
    const curr = await pool.query('SELECT is_read FROM inquiries WHERE id = $1;', [id])
    if (curr.rows.length === 0) return res.status(404).json({ message: 'Inquiry not found' })
    const newIsRead = !curr.rows[0].is_read
    const newStatus = newIsRead ? 'Sudah Dibalas' : 'Menunggu Balasan'
    await pool.query('UPDATE inquiries SET is_read = $1, status = $2 WHERE id = $3;', [newIsRead, newStatus, id])
    res.json({ success: true, id, isRead: newIsRead, status: newStatus })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/inquiries/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM inquiries WHERE id = $1;', [id])
    res.json({ success: true, message: 'Pesan berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==================== STUDIO SETTINGS APIS ====================
app.get('/api/studio/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM studio_settings WHERE id = 1;')
    if (result.rows.length > 0) {
      const s = result.rows[0]
      res.json({
        isOpenForCommissions: s.is_open_for_commissions,
        currentSlot: s.current_slot,
        statusNotice: s.status_notice,
      })
    } else {
      res.json({
        isOpenForCommissions: true,
        currentSlot: '2 Slot Tersedia untuk Q4 2026',
        statusNotice: 'Menerima pesanan ilustrasi buku anak dan desain karakter komersial.',
      })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/studio/settings', async (req, res) => {
  const s = req.body
  try {
    await pool.query(
      `INSERT INTO studio_settings (id, is_open_for_commissions, current_slot, status_notice, updated_at)
       VALUES (1, $1, $2, $3, NOW())
       ON CONFLICT (id)
       DO UPDATE SET is_open_for_commissions = $1, current_slot = $2, status_notice = $3, updated_at = NOW();`,
      [s.isOpenForCommissions, s.currentSlot, s.statusNotice]
    )
    res.json({ success: true, ...s })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 PostgreSQL Express API Server berjalan di http://localhost:${PORT}`)
})
