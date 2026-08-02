// lib/anthropic.ts
// Appel de l'IA Claude (Anthropic) pour generer un programme d'entrainement personnalise.
// On appelle l'API directement via fetch pour eviter d'ajouter une dependance.

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

export const REGENX_SYSTEM_PROMPT = `Tu es RegenX Coach, un coach sportif personnel expert en fitness, musculation et recuperation.

Ton role : creer des programmes d'entrainement detailles, surs et personnalises, adaptes au niveau, aux objectifs, au materiel disponible et aux contraintes de sante de la personne.

Regles importantes :
- Communique en francais.
- Adapte toujours l'intensite au niveau indique (debutant / intermediaire / avance).
- Tiens compte des conditions de sante mentionnees (ex : douleurs articulaires, spondylarthrite) et propose des adaptations prudentes.
- Ne remplace jamais un avis medical : rappelle de consulter un medecin en cas de doute ou de pathologie.
- Reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni apres, sans balises de code.`;

// Profil transmis a l'IA pour personnaliser le programme
export interface WorkoutUserProfile {
  fitnessLevel: string;
  goals: string[];
  availableDays: number;
  equipment: string[];
  durationMinutes: number;
  healthNotes?: string;
}

// Structure du programme renvoye par l'IA
export interface GeneratedWorkoutPlan {
  name: string;
  description: string;
  exercises: unknown[];
}

export async function generateWorkoutPlan(
  profile: WorkoutUserProfile
): Promise<GeneratedWorkoutPlan> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY manquante');
  }

  const health = profile.healthNotes && profile.healthNotes.trim() !== ''
    ? profile.healthNotes.trim()
    : 'aucune contrainte de sante particuliere';

  const userPrompt = `Cree un programme d'entrainement personnalise avec ces informations :
- Niveau : ${profile.fitnessLevel}
- Objectifs : ${profile.goals.join(', ') || 'general'}
- Jours disponibles par semaine : ${profile.availableDays}
- Materiel disponible : ${profile.equipment.join(', ') || 'sans equipement'}
- Duree par seance : ${profile.durationMinutes} minutes
- Sante / contraintes : ${health}

Reponds avec un objet JSON de cette forme exacte :
{
  "name": "Nom court du programme",
  "description": "Resume du programme en 2-3 phrases",
  "exercises": [
    {
      "day": "Jour 1",
      "focus": "Groupe musculaire ou type de seance",
      "items": [
        { "name": "Nom de l'exercice", "sets": 3, "reps": "8-12", "rest": "60s", "notes": "conseil ou adaptation" }
      ]
    }
  ]
}`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      system: REGENX_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Erreur API Anthropic (${response.status}) : ${detail}`);
  }

  const data = await response.json();
  const text: string = data?.content?.[0]?.text ?? '{}';

  // Nettoyage au cas ou l'IA ajoute des balises de code
  const cleaned = text.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();

  let parsed: GeneratedWorkoutPlan;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Reponse IA invalide (JSON illisible)');
  }

  return {
    name: parsed.name || 'Programme personnalise',
    description: parsed.description || '',
    exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
  };
}
