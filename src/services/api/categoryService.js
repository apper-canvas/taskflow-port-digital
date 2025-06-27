import categoriesData from '@/services/mockData/categories.json'

let categories = [...categoriesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const categoryService = {
  async getAll() {
    await delay(200)
    return [...categories]
  },

  async getById(id) {
    await delay(150)
    const category = categories.find(c => c.id === id)
    if (!category) throw new Error('Category not found')
    return { ...category }
  },

  async create(categoryData) {
    await delay(300)
    const maxId = Math.max(
      ...categories.map(c => c.id === parseInt(c.id) ? parseInt(c.id) : 0), 
      0
    )
    const newCategory = {
      id: (maxId + 1).toString(),
      name: categoryData.name,
      color: categoryData.color || '#5B4FE9',
      icon: categoryData.icon || 'Tag'
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, updateData) {
    await delay(250)
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    
    const updatedCategory = {
      ...categories[index],
      ...updateData
    }
    
    categories[index] = updatedCategory
    return { ...updatedCategory }
  },

  async delete(id) {
    await delay(200)
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    
    const deletedCategory = categories[index]
    categories.splice(index, 1)
    return { ...deletedCategory }
  }
}