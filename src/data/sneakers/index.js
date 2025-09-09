// Central sneaker data index - lazy loads individual sneaker data

// Lazy load individual sneaker data files
export const sneakerModules = {
  1: () => import('./sneaker1.jsx'),
  2: () => import('./sneaker2.jsx'),
  3: () => import('./sneaker3.jsx')
};

// Helper function to optimize Cloudinary URLs
export const optimizeCloudinaryUrl = (url, width = 600, quality = 85) => {
  if (!url.includes('res.cloudinary.com')) return url;

  const baseUrl = url.split('/upload/')[0];
  const path = url.split('/upload/')[1];
  return `${baseUrl}/upload/w_${width},q_${quality},f_auto/${path}`;
};

// Homepage sneaker posts data (lightweight preview data)
export const sneakerPosts = [
  {
    id: 3,
    slug: "nike-bionicle-sneaker-collaboration",
    title: "Nike x Bionicle Sneaker Collab",
    image: optimizeCloudinaryUrl("https://res.cloudinary.com/dnowyn8vw/image/upload/v1757197888/nike-lego-bionicle-shoes-box-toy-landscape-2_wwt3we.jpg", 600, 85),
    releaseDate: "2025-09-07",
    description: "Nike's #1 collab from the early 2000's you never knew existed"
  },
  {
    id: 2,
    slug: "tom-sachs-mars-yard-overshoe-sole-swapped",
    title: "Tom Sachs Mars Yard Overshoe SOLE SWAPPED",
    image: optimizeCloudinaryUrl("https://res.cloudinary.com/dnowyn8vw/image/upload/v1757197794/nike-tom-sachs-overshoe-sfb-sole-swapped-side-4_kw932w.jpg", 600, 85),
    releaseDate: "2025-09-06",
    description: "The most affordable Tom Sachs Mars Yard Shoe"
  },
  {
    id: 1,
    slug: "welcome-to-sneaker-chronicles",
    title: "Welcome to Sneaker Chronicles",
    image: optimizeCloudinaryUrl("https://res.cloudinary.com/dnowyn8vw/image/upload/v1757197734/welcome-sample-shoes.jpg", 600, 85),
    releaseDate: "2025-09-06",
    description: "Welcome to Sneaker Chronicles! Discover new and exotic Sneakers you've never seen before!"
  }
];

// Helper function to find sneaker by slug (now async)
export const findSneakerBySlug = async (slug) => {
  const post = sneakerPosts.find(sneaker => sneaker.slug === slug);
  if (!post) return null;

  const moduleLoader = sneakerModules[post.id];
  if (!moduleLoader) return null;

  const module = await moduleLoader();
  return module.default;
};

// Helper function to get sneaker by ID (now async)
export const getSneakerById = async (id) => {
  const moduleLoader = sneakerModules[id];
  if (!moduleLoader) return null;

  const module = await moduleLoader();
  return module.default;
};
