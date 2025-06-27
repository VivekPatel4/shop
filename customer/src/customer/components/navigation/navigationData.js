export const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [
        {
          name: 'New Arrivals',
          id: '#',
          imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          id: '#',
          imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', id: 'tops', href: '/women/clothing/tops' },
            { name: 'Dresses', id: 'dresses', href: '/women/clothing/dresses' },
            { name: 'Pants', id: 'pants', href: '/women/clothing/pants' },
            { name: 'Denim', id: 'denim', href: '/women/clothing/denim' },
            { name: 'Sweaters', id: 'sweaters', href: '/women/clothing/sweaters' },
            { name: 'T-Shirts', id: 'tshirts', href: '/women/clothing/tshirts' },
            { name: 'Jackets', id: 'jackets', href: '/women/clothing/jackets' },
            { name: 'Activewear', id: 'activewear', href: '/women/clothing/activewear' },
            { name: 'Browse All', id: 'browse-all', href: '/women/clothing' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', id: 'watches', href: '/women/accessories/watches' },
            { name: 'Wallets', id: 'wallets', href: '/women/accessories/wallets' },
            { name: 'Bags', id: 'bags', href: '/women/accessories/bags' },
            { name: 'Sunglasses', id: 'sunglasses', href: '/women/accessories/sunglasses' },
            { name: 'Hats', id: 'hats', href: '/women/accessories/hats' },
            { name: 'Belts', id: 'belts', href: '/women/accessories/belts' },
          ],
        },
        {
          id: 'brands',
          name: 'Brands',
          items: [
            { name: 'Full Nelson', id: 'full-nelson', href: '/women/brands/full-nelson' },
            { name: 'My Way', id: 'my-way', href: '/women/brands/my-way' },
            { name: 'Re-Arranged', id: 're-arranged', href: '/women/brands/re-arranged' },
            { name: 'Counterfeit', id: 'counterfeit', href: '/women/brands/counterfeit' },
            { name: 'Significant Other', id: 'significant-other', href: '/women/brands/significant-other' },
          ],
        },
      ],
    },
    {
      id: 'men',
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          id: '#',
          imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
          name: 'Artwork Tees',
          id: '#',
          imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-06.jpg',
          imageAlt:
            'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', id: 'tops', href: '/men/clothing/tops' },
            { name: 'Pants', id: 'pants', href: '/men/clothing/pants' },
            { name: 'Sweaters', id: 'sweaters', href: '/men/clothing/sweaters' },
            { name: 'T-Shirts', id: 'tshirts', href: '/men/clothing/tshirts' },
            { name: 'Jackets', id: 'jackets', href: '/men/clothing/jackets' },
            { name: 'Activewear', id: 'activewear', href: '/men/clothing/activewear' },
            { name: 'Browse All', id: 'browse-all', href: '/men/clothing' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', id: 'watches', href: '/men/accessories/watches' },
            { name: 'Wallets', id: 'wallets', href: '/men/accessories/wallets' },
            { name: 'Bags', id: 'bags', href: '/men/accessories/bags' },
            { name: 'Sunglasses', id: 'sunglasses', href: '/men/accessories/sunglasses' },
            { name: 'Hats', id: 'hats', href: '/men/accessories/hats' },
            { name: 'Belts', id: 'belts', href: '/men/accessories/belts' },
          ],
        },
        {
          id: 'brands',
          name: 'Brands',
          items: [
            { name: 'Re-Arranged', id: 're-arranged', href: '/men/brands/re-arranged' },
            { name: 'Counterfeit', id: 'counterfeit', href: '/men/brands/counterfeit' },
            { name: 'Full Nelson', id: 'full-nelson', href: '/men/brands/full-nelson' },
            { name: 'My Way', id: 'my-way', href: '/men/brands/my-way' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', id: 'company', href: '/company' },
    { name: 'Stores', id: 'stores', href: '/stores' },
  ],
};
