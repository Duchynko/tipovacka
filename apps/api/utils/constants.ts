export enum ResponseErrorCodes {
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_REQUEST_BODY = 'INVALID_REQUEST_BODY',
  UNAUTHORIZED_REQUEST = 'UNAUTHORIZED_REQUEST',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  IMPORT_NOT_SUCCESSFUL = 'IMPORT_NOT_SUCCESSFUL',
}

export enum ResponseMessages {
  RESOURCE_NOT_FOUND = 'The specified resource was not found.',
  INTERNAL_SERVER_ERROR = 'An unexpected error occurred on the server.',
  PASSWORD_SUCCESSFULLY_UPDATED = 'The password has been updated successfully.',
  PASSWORD_TOO_SHORT = 'The password provided in the request must be at least 6 characters long.',
  PASSWORDS_DONT_MATCH = 'The passwords provided in the request must match.',
  UNAUTHORIZED_REQUEST = "You don't have permissions to perform this action.",
  USER_EMAIL_ALREADY_EXISTS = 'A user with the provided e-mail address already exists.',
  GROUP_ID_DOESNT_EXIST = "A group with the specified ID doesn't exist.",
  NO_IMPORT_FILE = 'The request must contain an import file.',
  IMPORT_NOT_SUCCESSFUL = "The import of users haven't been processed successfully.",
  INVALID_FILE_FORMAT = 'The import file must be in the XLS(X) format.',
  USER_ID_NOT_PROVIDED_IN_QUERY = 'The request must contain an user ID in the query.',
  USER_ID_DOESNT_EXIST = "A user with the specified ID doesn't exist.",
  NO_API_TEAM_RESULTS = 'No team results found with the provided league ID and season.',
  NO_API_STATISTICS_RESULTS = 'No team statistics results found with the provided league ID and season.',
  NO_API_STANDINGS_RESULTS = 'No standings results found with the provided league ID and season.',
  NO_API_PLAYERS_RESULTS = 'No players results found with the provided league ID, team ID and season.',
}
