const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdminOrManager } = require('../middleware/roleMiddleware');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

/**
 * @route POST /api/upload
 * @desc General file upload to Supabase Storage
 * @access Admin/Manager
 */
router.post('/', authMiddleware, requireAdminOrManager, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        const { bucket = 'general' } = req.body;
        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Read file from temporary storage
        const fileData = fs.readFileSync(file.path);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileData, {
                contentType: file.mimetype,
                upsert: false
            });

        // Cleanup temporary file
        fs.unlinkSync(file.path);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        res.json({
            message: 'Archivo subido exitosamente',
            url: publicUrl,
            key: data.path
        });

    } catch (err) {
        // Cleanup on error if file exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
