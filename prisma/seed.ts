import { PrismaClient } from '@/generated/prisma';
import { calculateReadingTime } from '@/lib/reading-time';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const samplePosts = [
  {
    title: 'पावसाळ्यातले पत्र',
    slug: 'pavasalyatle-patra',
    language: 'marathi' as const,
    type: 'poem' as const,
    excerpt: 'कोसळत्या पावसात लिहिलेली आठवणींची चिठ्ठी.',
    body: `कागदावर गंध येतो पावसाचा\nथेंबांच्या चालतं अक्षरातून गावाचा\nखिडकीशी बसून लिहितो मी वारा\nतुझ्या आठवणींनी भिजतो उर सारा\n\nपानगळ झाल्यावरही सुगंध उरतो\nतुझ्या पत्रातील ओलावा अजूनही भरतो`,
    tags: ['monsoon', 'letters', 'nostalgia'],
    isFeatured: true,
    status: 'published' as const,
    coverImageUrl: 'https://images.unsplash.com/photo-1505482692513-34dd6c6e1a7f',
    publishedAt: new Date('2023-07-15T10:00:00Z'),
  },
  {
    title: 'देवळाच्या चाळीतला दुपार',
    slug: 'devlachya-chalitla-dupar',
    language: 'marathi' as const,
    type: 'short_story' as const,
    excerpt: 'गावठी कथेतून बालपणीच्या मैत्रीची लयलूट.',
    body: `शेजारच्या देवळाच्या चाळीतली दुपार नेहमीच थोडी लहान असते.\nछप्परातून झिरपू लागणारा प्रकाश जमिनीवर कापसासारखा पडलेला.\nग्रा्मफोनवर दत्तगुरूंची आरती चालू आणि आम्ही दोघे, हातात वाफाळलेला मोडका भात.\nएकाच ताटात खाण्याचा नियम आम्ही मोडला नव्हता.\n\nत्या दिवशी मी पहिल्यांदा समजलं— दुपार लहान होत नाही,\nआपली मैत्री मोठी होते.`,
    tags: ['friendship', 'childhood'],
    isFeatured: false,
    status: 'published' as const,
    coverImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    publishedAt: new Date('2023-11-22T14:30:00Z'),
  },
  {
    title: 'मूंगफली की शाम',
    slug: 'moongfali-ki-shaam',
    language: 'hindi' as const,
    type: 'poem' as const,
    excerpt: 'कागज़ के कोनों पर लिखी गई चाय और बारिश की स्मृतियाँ।',
    body: `चौक में आज फिर ख़ुशबू है भुने हुए दानों की\nऔर तुमने भेजी है आवाज़ पुरानी गली से\nकाग़ज़ के कोनों पर कमल की पंखुड़ियाँ रखकर\nमैंने बचा लिया है बरसों का धूप-छाँव खेल\n\nमूंगफली की शामें अब भी सुनाती हैं कहानी\nचाय की केतली में खौलता है शहर का बचपन`,
    tags: ['nostalgia', 'evening'],
    isFeatured: false,
    status: 'published' as const,
    coverImageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    publishedAt: new Date('2024-01-18T17:00:00Z'),
  },
  {
    title: 'खिड़की के बाहर',
    slug: 'khidki-ke-bahar',
    language: 'hindi' as const,
    type: 'short_story' as const,
    excerpt: 'रेल की पटरी के किनारे लिखी गई एक छोटी-सी कहानी।',
    body: `खिड़की के बाहर दौड़ते हुए पेड़ों को बच्चों ने हाथ हिलाया।\nकंडक्टर ने टिकट पर किस्मत की तरह स्टैम्प लगाया।\nरेल धीरे हुई तो वो बूढ़ी अम्मा दिखाई दी जिसने हमेशा स्टेशन पर नमक बेचकर घर चलाया था।\n\nआज उसने पहली बार मुस्कराकर पूछा—\n"इक दिन ठहर कर चाय पियोगे?"\nऔर मैंने तय किया, अगली बार उतर ही जाऊँगा।`,
    tags: ['journey', 'chai'],
    isFeatured: true,
    status: 'published' as const,
    coverImageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    publishedAt: new Date('2024-03-10T09:45:00Z'),
  },
  {
    title: 'Tea-Stained Margins',
    slug: 'tea-stained-margins',
    language: 'english' as const,
    type: 'poem' as const,
    excerpt: 'A quiet tea poem about notes scribbled along the margins.',
    body: `Every margin holds a tea stain halo\nWords ripple like late afternoon light\nYou underlined "remember" twice\nI circled "someday" with fountain pen ink\n\nWe pressed petals between paragraphs\nLetting time steep while the jade pot breathed`,
    tags: ['tea', 'memory'],
    isFeatured: true,
    status: 'published' as const,
    coverImageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247',
    publishedAt: new Date('2024-02-14T16:00:00Z'),
  },
  {
    title: 'The Postcard Merchant',
    slug: 'the-postcard-merchant',
    language: 'english' as const,
    type: 'short_story' as const,
    excerpt: 'A prose vignette about a collector who sells memories at a flea market.',
    body: `He sold postcards by the dozen, tied in velvet ribbon according to distant cities.\nEach card carried a smudge of thumb, a signature of rain.\nCustomers never bargained; they stood in reverence, heads tilted, choosing histories.\nHe never asked why they came. He only dusted the rusted rack and kept a quill ready\nfor the next stranger who wanted to write a return address.`,
    tags: ['postcards', 'vignette'],
    isFeatured: false,
    status: 'published' as const,
    coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    publishedAt: new Date('2024-04-21T11:20:00Z'),
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123';

  const passwordHash = await hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: 'admin',
    },
  });

  for (const post of samplePosts) {
    const readingTimeMinutes = calculateReadingTime(post.body);
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        ...post,
        readingTimeMinutes,
      },
      create: {
        ...post,
        readingTimeMinutes,
      },
    });
  }

  console.log('Seed data inserted. Admin:', adminEmail);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
