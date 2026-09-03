from pydantic import BaseModel, ConfigDict, Field, StringConstraints
from typing import Annotated, Literal, Union, Any

class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

IdStr = Annotated[str, Field(max_length=10)]
Str = Annotated[str, Field(max_length=100)]

#########################################
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
###### PAYLOAD SCHEMA ENFORCEMENT #####
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#########################################

class SectionChanges(StrictModel):
    title: Annotated[str, Field(max_length=50)] | None = None
    hs: Literal[1, 2, 3] | None = None
    questions: Annotated[list[Annotated[str, Field(max_length=2)]], Field(max_length=30)]| None = None
    index: int | None = None

class QuestionChanges(StrictModel):
    title: Str | None = None
    type: (
        Literal["ln", "sn", "cb", "a", "img", "n", "mc", "sc", "r", "st"]
        | None
    ) = None
    opt: dict[Annotated[str, StringConstraints(pattern=r"^[0-9]$")], Annotated[str, Field(max_length=50)]] | None = Field(default=None, max_length=10)
    minmax: Annotated[list[Annotated[int, Field(ge=-99999, le=99999)]], Field(min_length=2, max_length=2)] | None = None
    stars: Annotated[int, Field(ge=0, le=10)] | None = None

class SummaryChanges(StrictModel):
    picks: Annotated[list[Str], Field(max_length=500)] | None = None
    accept: Annotated[list[Str], Field(max_length=500)] | None = None
    reject: Annotated[list[Str], Field(max_length=500)] | None = None
    pos: Annotated[int, Field(ge=0, le=500)] | None = None
    
CompCodeChangePayload = Annotated[str, Field(max_length=25)]

CustomPayload = bool

class AddTeamPayload(StrictModel):
    num: Annotated[int, Field(ge=-99999, le=99999)]
    name: Annotated[str, Field(max_length=90)]
    code: Annotated[str, Field(max_length=6)] | None = None

AddTeamsPayload = Annotated[list[AddTeamPayload], Field(max_length=500)]

class DeleteTeamPayload(StrictModel):
    num: Annotated[str, Field(max_length=6)]

class UpdateTeamQuestionPayload(StrictModel):
    tId: Annotated[str, Field(max_length=6)]
    qId: Annotated[str, Field(max_length=3)]
    v: (
        Annotated[str, Field(max_length=400)]
        | Annotated[int, Field(ge=-999999, le=999999)]
        | bool
        | Annotated[list[Annotated[str, Field(max_length=1)]], Field(max_length=10)]
        | Annotated[list[int], Field(max_length=10)]
        | Annotated[list[bool], Field(max_length=10)]
        | None
    )

class AddMatchPayload(StrictModel):
    red1: Annotated[int, Field(ge=-999999, le=999999)]
    red2: Annotated[int, Field(ge=-999999, le=999999)]
    blue1: Annotated[int, Field(ge=-999999, le=999999)]
    blue2: Annotated[int, Field(ge=-999999, le=999999)]

AddMatchesPayload = Annotated[list[AddMatchPayload], Field(max_length=750)]

class UpdateScorePayload(StrictModel):
    k: Annotated[int, Field(ge=0, le=750)]
    a: Annotated[int, Field(ge=0, le=3)]
    q: Annotated[int, Field(ge=0, le=8)]
    # If a team scores 10 000 game elements, there is no doubt, just pick them or accept them
    v: Annotated[int, Field(ge=0, le=10000)]
    c: bool

class DeleteMatchPayload(StrictModel):
    key: Annotated[int, Field(ge=0, le=750)]

class AddSectionPayload(StrictModel):
    title: Str
    hs: Literal[1, 2, 3]

class DeleteSectionPayload(StrictModel):
    id: Annotated[str, Field(max_length=5)]
    dq: bool

class UpdateSectionPayload(StrictModel):
    id: Annotated[str, Field(max_length=5)]
    changes: SectionChanges

class UpdateSectionIndexesPayload(StrictModel):
    indexes: Annotated[
        dict[Annotated[str, StringConstraints(max_length=5)], Annotated[int, Field(ge=0, le=11)]],
        Field(max_length=11)
    ]

class AddQuestionPayload(StrictModel):
    id: Annotated[str, Field(max_length=5)]
    sId: Annotated[str, Field(max_length=5)]

class DeleteQuestionPayload(StrictModel):
    id: Annotated[str, Field(max_length=5)]

class UpdateQuestionPayload(StrictModel):
    id: Annotated[str, Field(max_length=5)]
    changes: QuestionChanges

MoveQuestionPayload = tuple[
    Annotated[str, Field(max_length=5)],
    Annotated[str, Field(max_length=5)],
    Annotated[list[Annotated[str, Field(max_length=5)]], Field(max_length=50)],
    Annotated[list[Annotated[str, Field(max_length=5)]], Field(max_length=50)]
]

class UpdateSummaryPayload(StrictModel):
    changes: SummaryChanges

AddInvitePayload = Annotated[str, Field(max_length=80)]

DeleteInvitePayload = Annotated[str, Field(max_length=80)]

DeleteMemberPayload = Annotated[str, Field(min_length=36, max_length=36)]

#########################################
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
###### MESSAGE SCHEMA ENFORCEMENT #####
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#########################################

class CompCodeChangeMsg(StrictModel):
    type: Literal["compCodeChange"]
    requestId: IdStr
    content: CompCodeChangePayload

class CustomMsg(StrictModel):
    type: Literal["custom"]
    requestId: IdStr
    content: CustomPayload

class AddTeamMsg(StrictModel):
    type: Literal["addTeam"]
    requestId: IdStr
    content: AddTeamPayload

class AddTeamsMsg(StrictModel):
    type: Literal["addTeams"]
    requestId: IdStr
    content: AddTeamsPayload

class DeleteTeamMsg(StrictModel):
    type: Literal["deleteTeam"]
    requestId: IdStr
    content: DeleteTeamPayload

class UpdateTeamQuestionMsg(StrictModel):
    type: Literal["updateTeamQuestion"]
    requestId: IdStr
    content: UpdateTeamQuestionPayload

class AddMatchMsg(StrictModel):
    type: Literal["addMatch"]
    requestId: IdStr
    content: AddMatchPayload

class AddMatchesMsg(StrictModel):
    type: Literal["addMatches"]
    requestId: IdStr
    content: AddMatchesPayload

class UpdateScoreMsg(StrictModel):
    type: Literal["updateScore"]
    requestId: IdStr
    content: UpdateScorePayload

class DeleteMatchMsg(StrictModel):
    type: Literal["deleteMatch"]
    requestId: IdStr
    content: DeleteMatchPayload

class AddSectionMsg(StrictModel):
    type: Literal["addSection"]
    requestId: IdStr
    content: AddSectionPayload

class DeleteSectionMsg(StrictModel):
    type: Literal["deleteSection"]
    requestId: IdStr
    content: DeleteSectionPayload

class UpdateSectionMsg(StrictModel):
    type: Literal["updateSection"]
    requestId: IdStr
    content: UpdateSectionPayload

class UpdateSectionIndexesMsg(StrictModel):
    type: Literal["updateSectionIndexes"]
    requestId: IdStr
    content: UpdateSectionIndexesPayload

class AddQuestionMsg(StrictModel):
    type: Literal["addQuestion"]
    requestId: IdStr
    content: AddQuestionPayload

class DeleteQuestionMsg(StrictModel):
    type: Literal["deleteQuestion"]
    requestId: IdStr
    content: DeleteQuestionPayload

class UpdateQuestionMsg(StrictModel):
    type: Literal["updateQuestion"]
    requestId: IdStr
    content: UpdateQuestionPayload

class MoveQuestionMsg(StrictModel):
    type: Literal["moveQuestion"]
    requestId: IdStr
    content: MoveQuestionPayload

class UpdateSummaryMsg(StrictModel):
    type: Literal["updateSummary"]
    requestId: IdStr
    content: UpdateSummaryPayload

class AddInviteMsg(StrictModel):
    type: Literal["addInvite"]
    requestId: IdStr
    content: AddInvitePayload

class DeleteInviteMsg(StrictModel):
    type: Literal["deleteInvite"]
    requestId: IdStr
    content: DeleteInvitePayload

class DeleteMemberMsg(StrictModel):
    type: Literal["deleteMember"]
    requestId: IdStr
    content: DeleteMemberPayload

WebSocketIncomingMessage = Annotated[
    Union[
        CompCodeChangeMsg,
        CustomMsg,
        AddTeamMsg,
        AddTeamsMsg,
        DeleteTeamMsg,
        UpdateTeamQuestionMsg,
        AddMatchMsg,
        AddMatchesMsg,
        UpdateScoreMsg,
        DeleteMatchMsg,
        AddSectionMsg,
        DeleteSectionMsg,
        UpdateSectionMsg,
        UpdateSectionIndexesMsg,
        AddQuestionMsg,
        DeleteQuestionMsg,
        UpdateQuestionMsg,
        MoveQuestionMsg,
        UpdateSummaryMsg,
        AddInviteMsg,
        DeleteInviteMsg,
        DeleteMemberMsg
    ],
    Field(discriminator="type")
]