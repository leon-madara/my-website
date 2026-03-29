/**
 * Portfolio Data Loader
 * Dynamically loads JSON data for portfolio projects
 * 
 * This loader fetches portfolio data from JSON files instead of
 * embedding it in the JavaScript bundle, allowing content updates
 * without rebuilding the entire React application.
 */

const PROJECTS_DATA = {
  'eastleigh-turf': '/portfolio_data/eastleigh.json',
  'delivah-logistics': '/portfolio_data/delivah.json'
};

/**
 * Load project data from JSON file
 * @param {string} projectId - Project identifier (e.g., 'eastleigh-turf')
 * @returns {Promise<Object>} Project data object
 * @throws {Error} If project not found or fetch fails
 */
async function loadProjectData(projectId) {
  const dataUrl = PROJECTS_DATA[projectId];
  
  if (!dataUrl) {
    throw new Error(`Project data not found for: ${projectId}`);
  }
  
  try {
    const response = await fetch(dataUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Loaded data for: ${projectId}`, data);
    return data;
  } catch (error) {
    console.error(`❌ Failed to load data for ${projectId}:`, error);
    throw error;
  }
}

/**
 * Load all available projects
 * @returns {Promise<Array>} Array of all project data objects
 * @throws {Error} If any project fails to load
 */
async function loadAllProjects() {
  const projectIds = Object.keys(PROJECTS_DATA);
  
  try {
    const projectsData = await Promise.all(
      projectIds.map(id => loadProjectData(id))
    );
    
    console.log(`✅ Loaded ${projectsData.length} projects`);
    return projectsData;
  } catch (error) {
    console.error('❌ Failed to load all projects:', error);
    throw error;
  }
}

/**
 * Get list of available project IDs
 * @returns {Array<string>} Array of project IDs
 */
function getAvailableProjects() {
  return Object.keys(PROJECTS_DATA);
}

/**
 * Check if a project exists
 * @param {string} projectId - Project identifier
 * @returns {boolean} True if project exists
 */
function projectExists(projectId) {
  return projectId in PROJECTS_DATA;
}

// Export API to global scope for use in portfolio app
window.PortfolioDataLoader = {
  loadProjectData,
  loadAllProjects,
  getAvailableProjects,
  projectExists,
  availableProjects: Object.keys(PROJECTS_DATA)
};

console.log('📦 Portfolio Data Loader initialized');
console.log('Available projects:', Object.keys(PROJECTS_DATA));
