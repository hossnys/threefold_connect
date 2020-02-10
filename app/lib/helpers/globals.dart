import 'package:flutter/material.dart';
import 'package:threebotlogin/helpers/hex_color.dart';
import 'package:threebotlogin/router.dart';

class Globals {
  static final bool isInDebugMode = true;
  static final HexColor color = HexColor("#2d4052");
  ValueNotifier<bool> emailVerified = ValueNotifier(false);
  final Router router = new Router();

  int incorrectPincodeAttempts = 0;
  bool tooManyAuthenticationAttempts = false;
  int lockedUntill = 0;
  int loginTimeout = 120;

  /* Singleton */
  static final Globals _singleton = new Globals._internal();
  factory Globals() {
    return _singleton;
  }
  Globals._internal() {
    //initialize
  }
}
