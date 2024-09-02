<?php

namespace Drupal\dw_graphql\Plugin\GraphQL\Authentication;

use Drupal\graphql\Plugin\GraphQL\Authentication\AuthenticationBase;
use Symfony\Component\HttpFoundation\Request;

/**
 * @GraphQLAuthentication(
 *   id = "jwt_auth",
 *   name = "JWT Authentication"
 * )
 */
class JwtAuthentication extends AuthenticationBase {
  public function applies(Request $request) {
    // Verify if JWT token is present.
    return $request->headers->has('Authorization');
  }

  public function authenticate(Request $request) {
    $token = str_replace('Bearer ', '', $request->headers->get('Authorization'));

    try {
      $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key('graphql_jwt', 'HS512'));
      return ['uid' => $decoded->sub];
    } catch (\Exception $e) {
      return FALSE;
    }
  }
}
