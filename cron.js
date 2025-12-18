const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (las variables de entorno se configuran en GitHub)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const ENDPOINTS = {
  pueblo: "https://back.clientesrecarga-acciona.com/api/v3/ubicaciones/648077a99a6d9e443643780d",
  bruselas: "https://back.clientesrecarga-acciona.com/api/v3/ubicaciones/648077a99a6d9e44364377cd"
};

async function checkAndSave() {
  for (const [id, url] of Object.entries(ENDPOINTS)) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const status = data.availableChargersCount > 0 ? 'available' : 'unavailable';

      const { error } = await supabase
        .from('chargers_log') // Asegúrate de que este es el nombre de tu tabla
        .insert([{ cargador_id: id, estado: status }]);

      if (error) throw error;
      console.log(`✅ ${id}: ${status} guardado.`);
    } catch (err) {
      console.error(`❌ Error en ${id}:`, err.message);
    }
  }
}

checkAndSave();
