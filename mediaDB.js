require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const mime = require('mime-types');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(fileName, fileData, expires) {
  const mimeType =  mime.lookup(fileName) 

  // Upload to bucket 'media'
  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, fileData, {
      contentType: mimeType,
    });

  if (error) {
    console.error('Failed:', error.message);
    return;
  }

  console.log('Successfully upload to storage:', data);
  
  // Get URL Media 
  const { data: signedUrlData, error: errorMsg } = await supabase
    .storage
    .from('media')
    .createSignedUrl('Thumbnail.png', 60 * 60); // expires at 1 hour
  
  if (errorMsg) {
    console.error('Failed on fetching signed URL:', errorMsg.message);
  } 


  // Save metadata to media database.
  const { error: insertError } = await supabase
    .from('phovid')
    .insert({
      name: fileName,
      url: signedUrlData.signedUrl,
      expires_at: expires,
      uploaded_at: new Date(),
    });

  if (insertError) {
    console.error('Failed to save metadata:', insertError.message);
  } else {
    console.log('Successfully saved metadata to database.'); // Assuming 'Key' is the UUID or unique identifier
  }
}

module.exports = { uploadImage };
