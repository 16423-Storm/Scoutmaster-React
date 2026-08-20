from handlers.handlers.competition import *
from handlers.handlers.teams import *
from handlers.handlers.matches import *

handlers = {
    "compCodeChange": handleCompCodeChange,
    "custom": handleCustom,

    "addTeam": handleAddTeam,
    "addTeams": handleAddTeams,

    "addMatch": handleAddMatch,
    "addMatches": handleAddMatches,
    "updateScore": handleUpdateScore,
    "deleteMatch": handleDeleteMatch
}