/**
 * AI Priority Engine for Kamsetu
 * This service analyzes report details to provide actionable recommendations and priority levels.
 */

const analyzeReport = (title, description, category) => {
  let priority = "Medium";
  let recommendation = "General maintenance required.";

  const content = (title + " " + description).toLowerCase();

  // High Priority Triggers: Safety hazards, major infrastructure, emergencies
  const highPriorityKeywords = [
    "dangerous", "accident", "emergency", "flood", "fire", "blocked", "heavy leakage", 
    "broken road", "sinkhole", "toxic", "collapsed", "injury", "danger"
  ];

  // Specific Category Logic
  if (category === "Broken Road" || category === "Water Leakage") {
    priority = "High";
    recommendation = "Immediate onsite inspection required due to safety and wastage risks.";
  } else if (category === "Drainage") {
    priority = "High";
    recommendation = "Potentially hazardous. Coordinate with sanitation immediately.";
  } else if (category === "Garbage") {
    priority = "Low";
    recommendation = "Route to routine waste management schedule.";
  }

  // Override based on keyword intensity
  const matchedHighCount = highPriorityKeywords.filter(k => content.includes(k)).length;
  if (matchedHighCount >= 2) {
    priority = "High";
    recommendation = "Critically urgent: Safety hazards detected in community description.";
  }

  // Feature Suggestion: Dynamic Department Routing
  const deptMapping = {
    "Pothole": "Public Works (Roads)",
    "Garbage": "Sanitation & Waste",
    "Drainage": "Sewage Control",
    "Water Leakage": "Water Supply Dept",
    "Broken Road": "Infrastructure (Emergency)",
    "Other": "General Maintenance"
  };

  recommendation += ` Assigned to: ${deptMapping[category] || "General Desk"}.`;

  return { priority, recommendation };
};

const generateStatusUpdate = (status, category, municipality) => {
  if (status === "In Progress") {
    return `Update for ${municipality}: The ${category} report has been assigned to a specialized field unit. Repairs and inspection are currently underway. We appreciate your patience as we work to resolve this incident.`;
  }
  if (status === "Resolved") {
    return `Final Clearance: The reported ${category} issue in ${municipality} has been successfully resolved. Our team has verified the work and the site is now back to normal. Thank you for contributing to a better community.`;
  }
  return "Status updated. Authorities are reviewing the latest progress.";
};

module.exports = { analyzeReport, generateStatusUpdate };
