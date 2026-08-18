from handlers.handlers.competition import *
from handlers.handlers.teams import *

handlers = {
    "compCodeChange": handleCompCodeChange,
    "custom": handleCustom,

    "addTeam": handleAddTeam,
    "addTeams": handleAddTeams
}