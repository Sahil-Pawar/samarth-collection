/**
 * Helper to construct WhatsApp messages with encoded parameters
 */
export function buildProductWhatsAppLink(phone, product, selectedSize = '') {
  const cleanPhone = (phone || '+919260439143').replace(/[^0-9]/g, '');
  const sizeText = selectedSize ? ` (साइज: ${selectedSize})` : '';
  const firstImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '';
  const imageUrl = firstImage.startsWith('http')
    ? firstImage
    : `${window.location.origin}${firstImage}`;

  const message = `🪔 *दिवाळी वस्त्र चौकशी व ऑर्डर*
*दुकान:* समर्थ कलेक्शन (आडगाव  रेपाळ)
*संपर्क:* पप्पू  बागूल (९२६०४३९१४३)

मला हा पोशाख पसंत आला आहे आणि ऑर्डर करायचा आहे:
*पोशाख:* ${product.title}
*विभाग:* ${product.category?.toUpperCase() || ''} - ${product.subCategory || ''}
${sizeText ? `*साइज:* ${selectedSize}\n` : ''}*कोड:* ${product.id}

📷 *फोटो लिंक:* ${imageUrl}

कृपया हा उपलब्ध आहे का ते सांगा. धन्यवाद!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildCartWhatsAppLink(phone, cartItems) {
  const cleanPhone = (phone || '+919260439143').replace(/[^0-9]/g, '');
  
  let itemsList = cartItems.map((item, index) => {
    return `${index + 1}. *${item.title}*\n   नग: ${item.quantity} | साइज: ${item.selectedSize || 'स्टँडर्ड'}`;
  }).join('\n\n');

  const message = `🪔 *नवीन दिवाळी ऑर्डर विनंती*
*दुकान:* समर्थ कलेक्शन (आडगाव  रेपाळ)
*संपर्क:* पप्पू  बागूल (९२६०४३९१४३)

*निवडलेले कपडे:*
${itemsList}

कृपया हे कपडे उपलब्ध आहेत का आणि डिलिव्हरी कशी होईल ते सांगा.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
