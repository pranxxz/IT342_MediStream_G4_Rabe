package com.medistream

import android.app.Application
import android.content.Context

class MediStreamApp : Application() {
    companion object {
        private lateinit var instance: MediStreamApp
        val appContext: Context get() = instance.applicationContext
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }
}
