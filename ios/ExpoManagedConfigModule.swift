import ExpoModulesCore

public class ExpoManagedConfigModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoManagedConfig")

    Function("getManagedConfig") {
      let defaults = UserDefaults.standard
      let config = defaults.dictionary(forKey: "com.apple.configuration.managed")
      if ((config) != nil) {
        return config!
      } else {
        return Dictionary<String, Any>()
      }
    }
  }
}
