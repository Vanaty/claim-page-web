# Wheel of Fortune Backend Integration

## Required Backend Endpoints

### 1. GET /api/wheel/data
Récupère les données de configuration de la roue pour un utilisateur.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "prizes": [
    {
      "id": "1",
      "name": "+10 jetons",
      "value": 10,
      "type": "tokens",
      "color": "#EE4040"
    },
    {
      "id": "2",
      "name": "+50 jetons",
      "value": 50,
      "type": "tokens",
      "color": "#F0CF50"
    },
    {
      "id": "3",
      "name": "Malchance",
      "value": 0,
      "type": "bad_luck",
      "color": "#815CD1"
    },
    {
      "id": "4",
      "name": "+20 jetons",
      "value": 20,
      "type": "tokens",
      "color": "#3DA5E0"
    },
    {
      "id": "5",
      "name": "+100 jetons",
      "value": 100,
      "type": "tokens",
      "color": "#34A24F"
    },
    {
      "id": "6",
      "name": "Malchance",
      "value": 0,
      "type": "bad_luck",
      "color": "#F9AA1F"
    },
    {
      "id": "7",
      "name": "+30 jetons",
      "value": 30,
      "type": "tokens",
      "color": "#EC3F3F"
    }
  ],
  "spinsRemaining": 3,
  "canSpin": true
}
```

### 2. POST /api/wheel/spin
Lance la roue et retourne le résultat avec signature.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "result": {
    "id": "2",
    "name": "+50 jetons",
    "value": 50,
    "type": "tokens",
    "color": "#F0CF50"
  },
  "signature": "a1b2c3d4e5f6...",
  "spinsRemaining": 2
}
```

## Backend Implementation Example (Python)

```python
import random
import hmac
import hashlib
import json
from datetime import datetime

# Configuration des prix
PRIZES = [
    {"id": "1", "name": "+10 jetons", "value": 10, "type": "tokens", "color": "#EE4040"},
    {"id": "2", "name": "+50 jetons", "value": 50, "type": "tokens", "color": "#F0CF50"},
    {"id": "3", "name": "Malchance", "value": 0, "type": "bad_luck", "color": "#815CD1"},
    {"id": "4", "name": "+20 jetons", "value": 20, "type": "tokens", "color": "#3DA5E0"},
    {"id": "5", "name": "+100 jetons", "value": 100, "type": "tokens", "color": "#34A24F"},
    {"id": "6", "name": "Malchance", "value": 0, "type": "bad_luck", "color": "#F9AA1F"},
    {"id": "7", "name": "+30 jetons", "value": 30, "type": "tokens", "color": "#EC3F3F"},
]

SECRET_KEY = "your-secret-key-here"

def sign_result(result):
    """Créer une signature pour vérifier l'intégrité du résultat"""
    message = json.dumps(result, sort_keys=True)
    signature = hmac.new(
        SECRET_KEY.encode(), 
        message.encode(), 
        hashlib.sha256
    ).hexdigest()
    return signature

def get_wheel_data(user_id):
    """GET /api/wheel/data"""
    # Récupérer le nombre de tours restants pour l'utilisateur
    # depuis la base de données
    spins_remaining = get_user_spins_remaining(user_id)
    
    return {
        "prizes": PRIZES,
        "spinsRemaining": spins_remaining,
        "canSpin": spins_remaining > 0
    }

def spin_wheel(user_id):
    """POST /api/wheel/spin"""
    # Vérifier si l'utilisateur peut encore tourner
    spins_remaining = get_user_spins_remaining(user_id)
    
    if spins_remaining <= 0:
        raise Exception("Plus de tours disponibles")
    
    # Sélectionner un prix au hasard
    result = random.choice(PRIZES)
    
    # Créer la signature
    signature = sign_result(result)
    
    # Mettre à jour la base de données
    update_user_spins(user_id, spins_remaining - 1)
    
    if result["type"] == "tokens":
        add_tokens_to_user(user_id, result["value"])
    
    # Enregistrer le résultat dans l'historique
    log_spin_result(user_id, result, datetime.now())
    
    return {
        "result": result,
        "signature": signature,
        "spinsRemaining": spins_remaining - 1
    }

# Fonctions de base de données à implémenter
def get_user_spins_remaining(user_id):
    # Retourner le nombre de tours restants depuis la DB
    pass

def update_user_spins(user_id, new_count):
    # Mettre à jour le nombre de tours restants
    pass

def add_tokens_to_user(user_id, tokens):
    # Ajouter des jetons au compte de l'utilisateur
    pass

def log_spin_result(user_id, result, timestamp):
    # Enregistrer le résultat dans l'historique
    pass
```

## Intégration Frontend

Le composant `WheelOfFortune` est maintenant configuré pour:

1. **Récupérer les données** au montage via `fetchWheelData()`
2. **Lancer la roue** via `spinWheel(userId)` quand l'utilisateur clique
3. **Traiter le résultat** reçu du backend avec signature de sécurité
4. **Mettre à jour l'interface** avec les tours restants et récompenses

### Utilisation

```jsx
import WheelOfFortune from './components/WheelOfFortune';

function App() {
  const [user, setUser] = useState(null);

  const handleRewardClaimed = (reward) => {
    console.log('Récompense reçue:', reward);
    // Mettre à jour l'interface utilisateur
  };

  const showToast = (type, message) => {
    // Afficher une notification
  };

  return (
    <WheelOfFortune
      userId={user?.id}
      showToast={showToast}
      onRewardClaimed={handleRewardClaimed}
      disabled={false}
    />
  );
}
```

## Sécurité

- **Signature HMAC** : Chaque résultat est signé pour prévenir la manipulation
- **Validation côté serveur** : Tous les spins sont validés par le backend
- **Authentification** : Nécessite un token Bearer valide
- **Rate limiting** : Limitation du nombre de tours par utilisateur/période
