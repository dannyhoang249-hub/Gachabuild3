import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: true, // Enable CDN for better performance
  apiVersion: process.env.SANITY_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
})

// GROQ queries for fetching data
export const queries = {
  // Get all characters
  getAllCharacters: `*[_type == "character"] | order(name.en asc) {
    _id,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    overview,
    image,
    splash,
    skills,
    build,
    recommendedWeapons,
    synergy,
    pros,
    cons
  }`,

  // Get character by slug
  getCharacterBySlug: `*[_type == "character" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    overview,
    image,
    splash,
    skills,
    build,
    recommendedWeapons,
    synergy,
    pros,
    cons
  }`,

  // Get all weapons
  getAllWeapons: `*[_type == "weapon"] | order(name.en asc) {
    _id,
    name,
    slug,
    type,
    rarity,
    description,
    passive,
    stats,
    image,
    recommendedCharacters
  }`,

  // Get weapon by slug
  getWeaponBySlug: `*[_type == "weapon" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    type,
    rarity,
    description,
    passive,
    stats,
    image,
    recommendedCharacters
  }`,

  // Get characters by role
  getCharactersByRole: `*[_type == "character" && role == $role] | order(name.en asc) {
    _id,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    overview,
    image,
    splash
  }`,

  // Get characters by element
  getCharactersByElement: `*[_type == "character" && element == $element] | order(name.en asc) {
    _id,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    overview,
    image,
    splash
  }`,

  // Get weapons by type
  getWeaponsByType: `*[_type == "weapon" && type == $type] | order(name.en asc) {
    _id,
    name,
    slug,
    type,
    rarity,
    description,
    image
  }`,

  // Get weapons by rarity
  getWeaponsByRarity: `*[_type == "weapon" && rarity == $rarity] | order(name.en asc) {
    _id,
    name,
    slug,
    type,
    rarity,
    description,
    image
  }`
}

// Helper functions for data fetching
export async function getAllCharacters() {
  return await sanityClient.fetch(queries.getAllCharacters)
}

export async function getCharacterBySlug(slug: string) {
  return await sanityClient.fetch(queries.getCharacterBySlug, { slug })
}

export async function getAllWeapons() {
  return await sanityClient.fetch(queries.getAllWeapons)
}

export async function getWeaponBySlug(slug: string) {
  return await sanityClient.fetch(queries.getWeaponBySlug, { slug })
}

export async function getCharactersByRole(role: string) {
  return await sanityClient.fetch(queries.getCharactersByRole, { role })
}

export async function getCharactersByElement(element: string) {
  return await sanityClient.fetch(queries.getCharactersByElement, { element })
}

export async function getWeaponsByType(type: string) {
  return await sanityClient.fetch(queries.getWeaponsByType, { type })
}

export async function getWeaponsByRarity(rarity: string) {
  return await sanityClient.fetch(queries.getWeaponsByRarity, { rarity })
}