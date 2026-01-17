const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Helper function to calculate distance between two coordinates in meters
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
}

/**
 * @route POST /api/qr/clock-in
 * @desc Handle employee attendance check-in/out via QR and geolocation
 */
router.post('/clock-in', async (req, res) => {
    const { qrCodeId, userId, lat, lng, type } = req.body;

    try {
        // 1. Find the stadium associated with this QR code
        // For simplicity, we assume the QR code ID is the stadium ID or we have a mapping
        // In this implementation, let's assume the QR code ID *is* the stadium ID for now
        const { data: stadium, error: stadiumError } = await supabase
            .from('stadiums')
            .select('*')
            .eq('id', qrCodeId)
            .single();

        if (stadiumError || !stadium) {
            return res.status(404).json({ error: 'Sede no encontrada o código QR inválido' });
        }

        // 2. Validate distance (must be < 100 meters)
        const distance = getDistance(lat, lng, stadium.location_lat, stadium.location_lng);

        if (distance > 100) {
            return res.status(403).json({
                error: 'Ubicación no autorizada',
                message: `Te encuentras a ${Math.round(distance)} metros de la sede. Debes estar a menos de 100 metros para fichar.`
            });
        }

        // 3. Record attendance
        const { data: attendance, error: attendanceError } = await supabase
            .from('attendance')
            .insert([{
                user_id: userId,
                type: type || 'check_in',
                location_lat: lat,
                location_lng: lng,
                timestamp: new Date().toISOString()
            }])
            .select()
            .single();

        if (attendanceError) throw attendanceError;

        res.json({
            success: true,
            message: `Fichaje de ${type === 'check_in' ? 'entrada' : 'salida'} exitoso`,
            data: attendance
        });

    } catch (error) {
        console.error('QR Clock-in error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * @route POST /api/qr/asset-move
 * @desc Handle machinery custody change and movement
 */
router.post('/asset-move', async (req, res) => {
    const { assetQrCode, userId, action, targetStadiumId } = req.body;

    try {
        // 1. Find the asset
        const { data: asset, error: assetError } = await supabase
            .from('assets')
            .select('*')
            .eq('qr_code', assetQrCode)
            .single();

        if (assetError || !asset) {
            return res.status(404).json({ error: 'Maquinaria no encontrada' });
        }

        const oldStadiumId = asset.current_stadium_id;

        // 2. Update asset status and location
        const updateData = {
            assigned_to_user_id: userId,
            updated_at: new Date().toISOString()
        };

        if (action === 'receive') {
            updateData.status = 'available';
            updateData.current_stadium_id = targetStadiumId;
        } else if (action === 'transfer') {
            updateData.status = 'in_use'; // Or 'in_transit' if we add that status
        }

        const { data: updatedAsset, error: updateError } = await supabase
            .from('assets')
            .update(updateData)
            .eq('id', asset.id)
            .select()
            .single();

        if (updateError) throw updateError;

        // 3. Record movement history
        const { error: historyError } = await supabase
            .from('asset_movements')
            .insert([{
                asset_id: asset.id,
                from_stadium_id: oldStadiumId,
                to_stadium_id: action === 'receive' ? targetStadiumId : oldStadiumId,
                moved_by_user_id: userId,
                notes: `Acción: ${action === 'receive' ? 'Recepción en sede' : 'Inicio de traslado'}`,
                timestamp: new Date().toISOString()
            }]);

        if (historyError) throw historyError;

        res.json({
            success: true,
            message: action === 'receive' ? 'Maquinaria recibida exitosamente' : 'Traslado iniciado',
            data: updatedAsset
        });

    } catch (error) {
        console.error('Asset move error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
