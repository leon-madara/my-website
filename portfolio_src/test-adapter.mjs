/**
 * Portfolio Adapter Test Script
 * 
 * Run with: node portfolio_src/test-adapter.mjs
 * 
 * This script validates the adapter works correctly by:
 * 1. Loading project data
 * 2. Running adapter transformation
 * 3. Checking output structure
 * 4. Verifying all projects present
 * 5. Validating section mappings
 */

import { adaptPortfolioData, getProject } from './src/adapters/portfolioAdapter.js';
import projectsData from './src/data/projectData.js';

console.log('\n='.repeat(60));
console.log('Portfolio TypeScript Adapter Test');
console.log('='.repeat(60) + '\n');

// ========================================================================
// Test 1: Basic Transformation
// ========================================================================
console.log('📦 Test 1: Basic Transformation');
try {
  const { projects, projectsMap } = adaptPortfolioData(projectsData);
  console.log('   ✅ Adapter runs without errors');
  console.log(`   ✅ Projects array: ${projects.length} projects`);
  console.log(`   ✅ Projects map: ${Object.keys(projectsMap).length} keys`);
  
  if (projects.length !== 3) {
    throw new Error(`Expected 3 projects, got ${projects.length}`);
  }
} catch (error) {
  console.error('   ❌ Error:', error.message);
  process.exit(1);
}

// ========================================================================
// Test 2: Project Existence
// ========================================================================
console.log('\n🔍 Test 2: Project Existence');
const { projects, projectsMap } = adaptPortfolioData(projectsData);

const expectedProjects = ['eastleigh', 'legit-logistics', 'edumanage'];
expectedProjects.forEach(id => {
  if (projectsMap[id]) {
    console.log(`   ✅ ${id}: Found`);
  } else {
    console.error(`   ❌ ${id}: Missing`);
    process.exit(1);
  }
});

// ========================================================================
// Test 3: Project Structure
// ========================================================================
console.log('\n🏛️  Test 3: Project Structure');
projects.forEach((project, index) => {
  console.log(`\n   Project ${index + 1}: ${project.title}`);
  
  // Check required fields
  const requiredFields = ['id', 'badge', 'title', 'summary', 'timeline', 'role', 'highlights', 'sections'];
  requiredFields.forEach(field => {
    if (project[field] !== undefined && project[field] !== null) {
      console.log(`      ✅ ${field}: ${typeof project[field]}`);
    } else {
      console.error(`      ❌ ${field}: Missing`);
      process.exit(1);
    }
  });
  
  // Check badge format
  if (project.badge === `0${index + 1}`) {
    console.log(`      ✅ Badge format correct: "${project.badge}"`);
  } else {
    console.error(`      ❌ Badge format wrong: expected "0${index + 1}", got "${project.badge}"`);
    process.exit(1);
  }
});

// ========================================================================
// Test 4: Highlights Extraction
// ========================================================================
console.log('\n✨ Test 4: Highlights Extraction');
projects.forEach(project => {
  console.log(`\n   ${project.title}:`);
  console.log(`      Highlights count: ${project.highlights.length}`);
  
  if (project.highlights.length > 0) {
    console.log(`      ✅ Has highlights`);
    project.highlights.forEach((highlight, i) => {
      console.log(`         ${i + 1}. ${highlight}`);
    });
  } else {
    console.warn(`      ⚠️  No highlights (this is okay but unusual)`);
  }
});

// ========================================================================
// Test 5: Section Mappings
// ========================================================================
console.log('\n📄 Test 5: Section Mappings');
projects.forEach(project => {
  console.log(`\n   ${project.title}:`);
  console.log(`      Total sections: ${project.sections.length}`);
  
  if (project.sections.length === 0) {
    console.error(`      ❌ No sections found`);
    process.exit(1);
  }
  
  let totalPages = 0;
  project.sections.forEach((section, i) => {
    totalPages += section.pages.length;
    console.log(`      ${i + 1}. ${section.title}: ${section.pages.length} pages`);
    
    // Validate section structure
    if (!section.id || !section.title || !section.pages) {
      console.error(`         ❌ Section missing required fields`);
      process.exit(1);
    }
    
    // Validate pages
    section.pages.forEach((page, pi) => {
      if (page.id === undefined || !page.title || !page.content) {
        console.error(`         ❌ Page ${pi + 1} missing required fields`);
        process.exit(1);
      }
    });
  });
  
  console.log(`      Total pages across all sections: ${totalPages}`);
  console.log(`      ✅ All sections valid`);
});

// ========================================================================
// Test 6: Single Project Retrieval
// ========================================================================
console.log('\n🎯 Test 6: Single Project Retrieval');
const eastleigh = getProject(projectsData, 'eastleigh');
const legitLogistics = getProject(projectsData, 'legit-logistics');
const edumanage = getProject(projectsData, 'edumanage');
const invalid = getProject(projectsData, 'nonexistent');

if (eastleigh && eastleigh.id === 'eastleigh') {
  console.log('   ✅ getProject("eastleigh") works');
} else {
  console.error('   ❌ getProject("eastleigh") failed');
  process.exit(1);
}

if (legitLogistics && legitLogistics.id === 'legit-logistics') {
  console.log('   ✅ getProject("legit-logistics") works');
} else {
  console.error('   ❌ getProject("legit-logistics") failed');
  process.exit(1);
}

if (edumanage && edumanage.id === 'edumanage') {
  console.log('   ✅ getProject("edumanage") works');
} else {
  console.error('   ❌ getProject("edumanage") failed');
  process.exit(1);
}

if (invalid === undefined) {
  console.log('   ✅ getProject("nonexistent") returns undefined');
} else {
  console.error('   ❌ getProject("nonexistent") should return undefined');
  process.exit(1);
}

// ========================================================================
// Test 7: Content Preservation
// ========================================================================
console.log('\n💾 Test 7: Content Preservation');
const originalIds = Object.keys(projectsData);
const adaptedIds = projects.map(p => p.id);

if (originalIds.length === adaptedIds.length) {
  console.log(`   ✅ All ${originalIds.length} projects preserved`);
} else {
  console.error(`   ❌ Project count mismatch: ${originalIds.length} → ${adaptedIds.length}`);
  process.exit(1);
}

originalIds.forEach(id => {
  if (adaptedIds.includes(id)) {
    console.log(`   ✅ ${id}: Preserved`);
  } else {
    console.error(`   ❌ ${id}: Lost in transformation`);
    process.exit(1);
  }
});

// ========================================================================
// Test 8: Data Integrity
// ========================================================================
console.log('\n🔒 Test 8: Data Integrity');
projects.forEach(project => {
  const original = projectsData[project.id];
  
  // Check key fields match
  if (project.title === original.name) {
    console.log(`   ✅ ${project.id}: Title preserved`);
  } else {
    console.error(`   ❌ ${project.id}: Title mismatch`);
    process.exit(1);
  }
  
  if (project.timeline === original.timeline) {
    console.log(`   ✅ ${project.id}: Timeline preserved`);
  } else {
    console.error(`   ❌ ${project.id}: Timeline mismatch`);
    process.exit(1);
  }
  
  if (project.summary === original.tagline) {
    console.log(`   ✅ ${project.id}: Summary preserved`);
  } else {
    console.error(`   ❌ ${project.id}: Summary mismatch`);
    process.exit(1);
  }
});

// ========================================================================
// Summary
// ========================================================================
console.log('\n' + '='.repeat(60));
console.log('✅ ALL TESTS PASSED');
console.log('='.repeat(60));
console.log('\nAdapter Statistics:');
console.log(`   Projects: ${projects.length}`);
projects.forEach((project, i) => {
  const pages = project.sections.reduce((sum, s) => sum + s.pages.length, 0);
  console.log(`   ${i + 1}. ${project.title}:`);
  console.log(`      - Sections: ${project.sections.length}`);
  console.log(`      - Pages: ${pages}`);
  console.log(`      - Highlights: ${project.highlights.length}`);
});

console.log('\n✨ The TypeScript adapter is working perfectly!\n');
