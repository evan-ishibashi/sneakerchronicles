// Helper function to find sneaker by slug
export const findSneakerBySlug = (slug) => {
  return Object.values(sneakerData).find(sneaker => sneaker.slug === slug)
}

// Homepage sneaker posts data
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
]