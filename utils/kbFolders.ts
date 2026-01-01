import { KBFolder, KnowledgeArticle } from '../data/knowledgeBase'

// Тип для узла дерева (для react-arborist)
export interface FolderTreeNode {
  id: string
  name: string
  parent_id: string | null
  children?: FolderTreeNode[]
}

// Построение дерева из плоского массива папок
export function buildFolderTree(folders: KBFolder[]): FolderTreeNode[] {
  const folderMap = new Map<string, FolderTreeNode>()
  const rootFolders: FolderTreeNode[] = []

  // Сначала создаем все узлы
  folders.forEach((folder) => {
    folderMap.set(folder.id, {
      id: folder.id,
      name: folder.name,
      parent_id: folder.parent_id,
      children: [],
    })
  })

  // Затем связываем детей с родителями
  folders.forEach((folder) => {
    const node = folderMap.get(folder.id)!
    if (folder.parent_id === null) {
      rootFolders.push(node)
    } else {
      const parent = folderMap.get(folder.parent_id)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      }
    }
  })

  // Сортируем по имени
  const sortChildren = (nodes: FolderTreeNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children)
      }
    })
  }

  sortChildren(rootFolders)

  return rootFolders
}

// Получение пути к папке (для breadcrumbs)
export function getFolderPath(
  folderId: string | null,
  folders: KBFolder[]
): KBFolder[] {
  if (folderId === null) {
    return []
  }

  const folderMap = new Map<string, KBFolder>()
  folders.forEach((folder) => {
    folderMap.set(folder.id, folder)
  })

  const path: KBFolder[] = []
  let currentId: string | null = folderId

  while (currentId !== null) {
    const folder = folderMap.get(currentId)
    if (!folder) break

    path.unshift(folder)
    currentId = folder.parent_id
  }

  return path
}

// Получение всех статей в папке (рекурсивно, включая подпапки)
export function getArticlesInFolder(
  articles: KnowledgeArticle[],
  folderId: string | null,
  folders: KBFolder[]
): KnowledgeArticle[] {
  if (folderId === null) {
    // Корневая папка - возвращаем статьи без folder_id
    return articles.filter((article) => article.folder_id === null)
  }

  // Найти все подпапки рекурсивно
  const getSubfolderIds = (parentId: string): string[] => {
    const subfolderIds: string[] = []
    const directChildren = folders.filter((f) => f.parent_id === parentId)
    
    directChildren.forEach((child) => {
      subfolderIds.push(child.id)
      subfolderIds.push(...getSubfolderIds(child.id))
    })

    return subfolderIds
  }

  const allFolderIds = [folderId, ...getSubfolderIds(folderId)]
  
  return articles.filter((article) => 
    article.folder_id !== null && allFolderIds.includes(article.folder_id)
  )
}

// Подсчет количества статей в папке (рекурсивно)
export function getFolderArticleCount(
  folderId: string | null,
  articles: KnowledgeArticle[],
  folders: KBFolder[]
): number {
  return getArticlesInFolder(articles, folderId, folders).length
}

// Получение всех прямых подпапок
export function getSubfolders(
  folderId: string | null,
  folders: KBFolder[]
): KBFolder[] {
  return folders.filter((folder) => folder.parent_id === folderId)
}

// Получение родительской папки
export function getParentFolder(
  folderId: string | null,
  folders: KBFolder[]
): KBFolder | null {
  if (folderId === null) return null
  const folder = folders.find((f) => f.id === folderId)
  if (!folder || folder.parent_id === null) return null
  return folders.find((f) => f.id === folder.parent_id) || null
}

// Подсчет прямых подпапок в папке
export function getDirectSubfoldersCount(
  folderId: string | null,
  folders: KBFolder[]
): number {
  return folders.filter((f) => f.parent_id === folderId).length
}

// Подсчет прямых статей в папке
export function getDirectArticlesCount(
  folderId: string | null,
  articles: KnowledgeArticle[]
): number {
  return articles.filter((a) => a.folder_id === folderId).length
}

