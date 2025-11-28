"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = 'en' | 'es' | 'fr'

type TranslationKey = string

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {}, // English is default, so translations can be empty
  es: {
    // Navigation
    'Home': 'Inicio',
    'Shop': 'Tienda',
    'Collection': 'Colección',
    'Our Story': 'Nuestra Historia',
    'Contact': 'Contacto',
    'Cart': 'Carrito',
    'Wishlist': 'Lista de Deseos',
    'Account': 'Cuenta',
    'Login': 'Iniciar Sesión',
    'Logout': 'Cerrar Sesión',
    'Search': 'Buscar',
    
    // Common
    'Add to Cart': 'Añadir al Carrito',
    'Add to Wishlist': 'Añadir a Lista de Deseos',
    'Remove from Wishlist': 'Quitar de Lista de Deseos',
    'Out of Stock': 'Agotado',
    'In Stock': 'Disponible',
    'Price': 'Precio',
    'Size': 'Talla',
    'Color': 'Color',
    'Material': 'Material',
    'Description': 'Descripción',
    'Category': 'Categoría',
    
    // Product
    'Products': 'Productos',
    'Product': 'Producto',
    'No products found': 'No se encontraron productos',
    'Loading...': 'Cargando...',
    
    // Wishlist
    'My Wishlist': 'Mi Lista de Deseos',
    'Your wishlist is empty': 'Tu lista de deseos está vacía',
    'items saved': 'artículos guardados',
    'item saved': 'artículo guardado',
    'Start adding items you love to your wishlist.': 'Comienza a añadir artículos que te encantan a tu lista de deseos.',
    'Browse Products': 'Explorar Productos',
    
    // Auth
    'Sign in to view your wishlist': 'Inicia sesión para ver tu lista de deseos',
    'Please sign in to see your saved items.': 'Por favor inicia sesión para ver tus artículos guardados.',
    'Sign In': 'Iniciar Sesión',
    
    // Filters
    'Filters': 'Filtros',
    'All Categories': 'Todas las Categorías',
    'All Sizes': 'Todas las Tallas',
    'All Colors': 'Todos los Colores',
    'All Materials': 'Todos los Materiales',
    'Price Range': 'Rango de Precios',
    'In Stock Only': 'Solo Disponibles',
    'Sort By': 'Ordenar Por',
    'Featured': 'Destacados',
    'Price: Low to High': 'Precio: Menor a Mayor',
    'Price: High to Low': 'Precio: Mayor a Menor',
    'Name: A to Z': 'Nombre: A a Z',
    'Name: Z to A': 'Nombre: Z a A',
    'Newest First': 'Más Recientes Primero',
  },
  fr: {
    // Navigation
    'Home': 'Accueil',
    'Shop': 'Boutique',
    'Collection': 'Collection',
    'Our Story': 'Notre Histoire',
    'Contact': 'Contact',
    'Cart': 'Panier',
    'Wishlist': 'Liste de Souhaits',
    'Account': 'Compte',
    'Login': 'Se Connecter',
    'Logout': 'Se Déconnecter',
    'Search': 'Rechercher',
    
    // Common
    'Add to Cart': 'Ajouter au Panier',
    'Add to Wishlist': 'Ajouter à la Liste de Souhaits',
    'Remove from Wishlist': 'Retirer de la Liste de Souhaits',
    'Out of Stock': 'Rupture de Stock',
    'In Stock': 'En Stock',
    'Price': 'Prix',
    'Size': 'Taille',
    'Color': 'Couleur',
    'Material': 'Matière',
    'Description': 'Description',
    'Category': 'Catégorie',
    
    // Product
    'Products': 'Produits',
    'Product': 'Produit',
    'No products found': 'Aucun produit trouvé',
    'Loading...': 'Chargement...',
    
    // Wishlist
    'My Wishlist': 'Ma Liste de Souhaits',
    'Your wishlist is empty': 'Votre liste de souhaits est vide',
    'items saved': 'articles enregistrés',
    'item saved': 'article enregistré',
    'Start adding items you love to your wishlist.': 'Commencez à ajouter des articles que vous aimez à votre liste de souhaits.',
    'Browse Products': 'Parcourir les Produits',
    
    // Auth
    'Sign in to view your wishlist': 'Connectez-vous pour voir votre liste de souhaits',
    'Please sign in to see your saved items.': 'Veuillez vous connecter pour voir vos articles enregistrés.',
    'Sign In': 'Se Connecter',
    
    // Filters
    'Filters': 'Filtres',
    'All Categories': 'Toutes les Catégories',
    'All Sizes': 'Toutes les Tailles',
    'All Colors': 'Toutes les Couleurs',
    'All Materials': 'Tous les Matériaux',
    'Price Range': 'Gamme de Prix',
    'In Stock Only': 'En Stock Seulement',
    'Sort By': 'Trier Par',
    'Featured': 'En Vedette',
    'Price: Low to High': 'Prix: Croissant',
    'Price: High to Low': 'Prix: Décroissant',
    'Name: A to Z': 'Nom: A à Z',
    'Name: Z to A': 'Nom: Z à A',
    'Newest First': 'Plus Récent en Premier',
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  translateText: (text: string) => Promise<string>
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && ['en', 'es', 'fr'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  // Simple translation function
  const t = (key: string): string => {
    if (language === 'en') return key
    return translations[language][key] || key
  }

  // Translate text using translations dictionary or return original
  const translateText = async (text: string): Promise<string> => {
    if (language === 'en' || !text) return text
    
    // Check if exact match exists
    if (translations[language][text]) {
      return translations[language][text]
    }
    
    // Try to find partial matches for product descriptions, etc.
    // For now, return original text if no translation found
    // In production, you might want to use a translation API
    return text
  }

  const value = {
    language,
    setLanguage,
    t,
    translateText,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}

