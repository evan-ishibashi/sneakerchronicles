// Central sneaker data index - lazy loads individual sneaker data

// Lazy load individual sneaker data files
export const sneakerModules = {
  1: () => import('./sneaker1.jsx'),
  2: () => import('./sneaker2.jsx'),
  3: () => import('./sneaker3.jsx')
};

// Homepage sneaker posts data (lightweight preview data)
export const sneakerPosts = [
  {
    id: 3,
    slug: "nike-bionicle-sneaker-collaboration",
    title: "Nike x Bionicle Sneaker Collab",
    image: "https://res.cloudinary.com/dnowyn8vw/image/upload/v1757197888/nike-lego-bionicle-shoes-box-toy-landscape-2_wwt3we.jpg",
    releaseDate: "2025-09-07",
    description: "Nike's #1 collab from the early 2000's you never knew existed"
  },
  {
    id: 2,
    slug: "tom-sachs-mars-yard-overshoe-sole-swapped",
    title: "Tom Sachs Mars Yard Overshoe SOLE SWAPPED",
    image: "https://res.cloudinary.com/dnowyn8vw/image/upload/v1757197794/nike-tom-sachs-overshoe-sfb-sole-swapped-side-4_kw932w.jpg",
    releaseDate: "2025-09-06",
    description: "The most affordable Tom Sachs Mars Yard Shoe"
  },
  {
    id: 1,
    slug: "welcome-to-sneaker-chronicles",
    title: "Welcome to Sneaker Chronicles",
    image: "https://res.cloudinary.com/dnowyn8vw/image/upload/v1757197734/welcome-sample-shoes.jpg",
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
