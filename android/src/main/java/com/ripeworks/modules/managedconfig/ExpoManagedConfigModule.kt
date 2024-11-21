package com.ripeworks.modules.managedconfig

import android.content.*
import android.os.Bundle
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoManagedConfigModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoManagedConfig")

    Function("getManagedConfig") {
      return@Function try {
        val restrictionsManager: RestrictionsManager = context.getSystemService(Context.RESTRICTIONS_SERVICE) as RestrictionsManager
        restrictionsManager.applicationRestrictions
      } catch (e: Exception) {
        Bundle()
      }
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)
}
