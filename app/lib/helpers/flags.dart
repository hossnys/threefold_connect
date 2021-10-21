import 'package:flagsmith/flagsmith.dart';
import 'package:threebotlogin/app_config.dart';
import 'package:threebotlogin/services/user_service.dart';

class Flags {
  static final Flags _singleton = new Flags._internal();

  FlagsmithClient client;

  Map<String, String> flagSmithConfig = AppConfig().flagSmithConfig();

  Future<void> initialiseFlagSmith() async {
    client = await FlagsmithClient.init(
        config: FlagsmithConfig(
          baseURI: flagSmithConfig['url'],
        ),
        apiKey: flagSmithConfig['apiKey']);


    String doubleName = await getDoubleName();

    if(doubleName != null) {
      FeatureUser user = FeatureUser(identifier: doubleName);

      try {
        await client.getFeatureFlags(user: user, reload: true);
      }

      catch(e) {
        print(e);
      }
    }
  }

  Future<bool> getFlagValueByFeatureName(String name) async {
    if (client != null) {
      return (await client.hasFeatureFlag(name));
    }

    return false;
  }

  factory Flags() {
    return _singleton;
  }

  Flags._internal();
}
