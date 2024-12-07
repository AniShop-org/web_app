import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [],
  filteredProducts: [],
  filters: {
    keyword: '',
    categoryId: null,
    minPrice: 0,
    maxPrice: 2000,
    minRating: 0,
    limit: 10,
  },
  currentPage: 1,
  loading: false,

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  setCurrentPage: (page) => set({ currentPage: page }),

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const { currentPage, filters } = useProductStore.getState();
      console.log(filters)
      const response = await fetch(
        `https://anishop-backend-test.onrender.com/api/v1/products/search-filter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: filters.keyword,
            categoryId: filters.categoryId,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minRating: filters.minRating,
            page: currentPage,
            limit: filters.limit,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      set({ products: data, filteredProducts: data, loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ loading: false });
    }
  },

  applyFilters: () => {
    useProductStore.getState().fetchProducts();
  }
}));

export default useProductStore;