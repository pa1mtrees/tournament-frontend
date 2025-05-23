// filepath: src/utils/avatarUtils.js
/**
 * Generates a consistent seed for DiceBear avatars based on the entity type and available data.
 * @param {object} entity - The entity (participant, user, team, or generic object with id/name).
 * @returns {string} A seed string.
 */
export const generateDiceBearSeedForEntity = (entity) => {
  if (!entity) return Math.random().toString(36).substring(7); // Random fallback

  // Case 1: Entity is a participant object from tournament API (contains .user or .team nested)
  // These objects typically have 'user_id' or 'team_id' properties, and a top-level 'id' for the participant entry.
  if (entity.hasOwnProperty('user_id') || entity.hasOwnProperty('team_id')) {
    if (entity.user) { // User participant
      return String(
        entity.user.email ||
        entity.user.nickname ||
        entity.user.first_name ||
        entity.user.id || // User's database ID
        entity.id       // Participant entry ID as final fallback for this user participant
      );
    }
    if (entity.team) { // Team participant
      return String(
        entity.team.name ||
        entity.team.id || // Team's database ID
        entity.id       // Participant entry ID as final fallback for this team participant
      );
    }
    // If participant entry but .user and .team are null (e.g., TBD slot), use participant entry ID
    return String(entity.id);
  }

  // Case 2: Entity is a direct user object (e.g., from authStore, user profile fetch)
  // Heuristic: has 'email' or 'nickname', and not participant-specific keys like 'team_id'.
  if ((entity.hasOwnProperty('email') || entity.hasOwnProperty('nickname') || entity.hasOwnProperty('first_name')) && 
      !entity.hasOwnProperty('team_id') && !entity.hasOwnProperty('user_id')) {
    return String(entity.email || entity.nickname || entity.first_name || entity.id); // User's database ID
  }

  // Case 3: Entity is a direct team object (e.g., team profile fetch)
  // Heuristic: has 'captain_id' (common in team objects) and 'name', and not participant-specific keys.
  if (entity.hasOwnProperty('captain_id') && entity.hasOwnProperty('name') && 
      !entity.hasOwnProperty('user_id') && !entity.hasOwnProperty('team_id')) {
    return String(entity.name || entity.id); // Team's database ID
  }
  
  // Case 4: Fallback for generic objects (e.g., from bracketData.participants_map {id, name})
  // or if above heuristics don't precisely match. Prioritize ID if available.
  // This 'id' is expected to be the user's or team's database ID.
  return String(entity.id || entity.name || Math.random().toString(36).substring(7));
};

/**
 * Generates a full DiceBear identicon URL for a given entity.
 * @param {object} entity - The entity to generate an avatar for.
 * @returns {string} The DiceBear avatar URL.
 */
export const getDiceBearAvatarUrl = (entity) => {
  const seed = generateDiceBearSeedForEntity(entity);
  return `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
};