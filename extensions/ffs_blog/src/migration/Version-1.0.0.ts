import { execute } from '@evershop/postgres-query-builder';

export default async (connection) => {
  await execute(connection, `
    CREATE TABLE IF NOT EXISTS ffs_blog_post (
      post_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      title varchar NOT NULL,
      slug varchar NOT NULL UNIQUE,
      excerpt text NOT NULL,
      content text NOT NULL,
      image varchar,
      category varchar NOT NULL DEFAULT 'Updates',
      status varchar NOT NULL DEFAULT 'draft',
      meta_title varchar,
      meta_description text,
      published_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const posts = [
    {
      title: 'The Hidden Danger of Pressurized Fuel Tanks in Heavy Machinery',
      slug: 'the-hidden-danger-of-pressurized-fuel-tanks-in-heavy-machinery',
      excerpt: 'Time is money in heavy industry. Beneath common fast-fill fueling setups lies an engineering flaw that can lead to spills, equipment damage, and dangerous accidents.',
      image: '/ffs/updates/pressurized-fuel-tanks.jpg',
      category: 'Industry Safety',
      date: '2026-05-15T12:00:00Z',
      content: `<p>Time is money in heavy industry. When you are running massive equipment like a CAT 777, fast-fill fuel systems are essential to minimize downtime and keep operations moving. But beneath the surface of these common fueling setups lies a significant engineering flaw that can lead to costly spills, equipment damage, and dangerous accidents: the reliance on pressurized fuel tanks.</p>
<h2>The Mechanics: How Pressurized Systems Work</h2>
<p>Traditional fast-fill systems use internal tank pressure to dictate when to stop fueling.</p>
<ul><li><strong>The Process:</strong> As diesel pumps into the tank at high speeds, displaced air escapes through a dedicated vent.</li><li><strong>The Trigger:</strong> When the fuel hits maximum capacity, that vent seals shut.</li><li><strong>The Shut-off:</strong> Closing the vent causes a sudden spike in internal tank pressure. This back-pressure travels up the line and mechanically trips the fuel nozzle.</li></ul>
<h2>The Vulnerability: A Single Point of Failure</h2>
<p>In the harsh reality of a mining or construction site, this represents a massive vulnerability. Most legacy systems lack a secondary shut-off mechanism in either the vent or receiver. If the vent sticks open, or the heavily used nozzle sensor wears out, the system never receives the signal to stop.</p>
<ul><li><strong>Catastrophic Overflow:</strong> Fuel is forced out of the vent tube, creating costly environmental spills.</li><li><strong>Tank Rupture:</strong> If the vent closes but the nozzle fails to trigger, pressure can split structural tank welds.</li><li><strong>Fire Hazards:</strong> High volumes of diesel around hot exhaust and engine components create an immediate safety risk.</li></ul>
<h2>The Engineering Fix: Moving to Non-Pressurized Systems</h2>
<p>The goal is to design out single points of failure. Fleets should transition to non-pressurized systems that isolate the structural tank from pump pressure and install secondary mechanical shut-off valves based on actual fluid level.</p>
<p>Upgrading is about protecting equipment, the environment, and most importantly, personnel. It is time to engineer the risk out of fueling processes.</p>`
    },
    {
      title: 'Welcome to a New Era: Introducing the Reimagined FastFillSystems.com',
      slug: 'welcome-to-a-new-era-introducing-the-reimagined-fastfillsystems-com',
      excerpt: 'Fast Fill Systems unveils a completely revamped website built to make it easier to explore high-speed refueling solutions, specifications, and industry insights.',
      image: '/ffs/updates/new-era.jpg',
      category: 'Company News',
      date: '2024-03-02T12:00:00Z',
      content: `<p>We at Fast Fill Systems have always prided ourselves on being a premier provider of high-speed refueling systems, delivering innovative and durable solutions that save time, reduce operating costs, and improve safety in the field.</p>
<p>We’ve never been more excited to share that mission than now, with the unveiling of our completely revamped website.</p>
<img src="/ffs/updates/atlas-header.jpg" alt="Fast Fill Systems fueling equipment" />
<h2>What’s New?</h2>
<p>Our website is more than a fresh coat of digital paint. It is a reflection of our evolving identity and a commitment to our customers that we are always looking forward.</p>
<p>The site showcases a modern design, an easy-to-navigate layout, and in-depth information about our refueling systems. Product pages include detailed specifications, user guides, and related products.</p>
<p>Our Updates section will share industry insights, company news, and technical tips, keeping you informed about trends and advances in refueling systems.</p>
<h2>What’s Next?</h2>
<p>Fast Fill Systems has always been about moving forward. We have exciting plans ranging from new products to strategic partnerships that will bring even more value to our customers.</p>
<h2>Thank You!</h2>
<p>We extend a heartfelt thank you to our clients, partners, and team members. Your trust and dedication have been key to our success. The new era of high-speed refueling is here.</p>`
    }
  ];

  for (const post of posts) {
    await connection.query(
      `INSERT INTO ffs_blog_post
       (title, slug, excerpt, content, image, category, status, meta_title, meta_description, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,'published',$1,$3,$7)
       ON CONFLICT (slug) DO NOTHING`,
      [post.title, post.slug, post.excerpt, post.content, post.image, post.category, post.date]
    );
  }
};
