package com.medistream.core.ui

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.google.android.material.snackbar.Snackbar
import com.medistream.R

open class BaseActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    protected fun setupToolbar(toolbar: Toolbar, title: String, showBackButton: Boolean = true) {
        setSupportActionBar(toolbar)
        supportActionBar?.apply {
            this.title = title
            setDisplayHomeAsUpEnabled(showBackButton)
            setDisplayShowHomeEnabled(showBackButton)
        }
        if (showBackButton) {
            toolbar.setNavigationOnClickListener {
                onBackPressedDispatcher.onBackPressed()
            }
        }
    }

    fun showSnackbar(message: String, isError: Boolean = false) {
        val rootView = findViewById<View>(android.R.id.content)
        if (rootView != null) {
            showPremiumSnackbar(rootView, message, isError)
        } else {
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }
    }

    fun showPremiumSnackbar(view: View, message: String, isError: Boolean = false) {
        try {
            val snackbar = Snackbar.make(view, "", Snackbar.LENGTH_LONG)
            val layout = snackbar.view as Snackbar.SnackbarLayout

            // Make background transparent and clear padding
            layout.setBackgroundColor(android.graphics.Color.TRANSPARENT)
            layout.setPadding(0, 0, 0, 0)

            // Hide standard texts
            val text = layout.findViewById<View>(com.google.android.material.R.id.snackbar_text)
            text?.visibility = View.INVISIBLE
            val action = layout.findViewById<View>(com.google.android.material.R.id.snackbar_action)
            action?.visibility = View.INVISIBLE

            // Inflate custom layout
            val customView = android.view.LayoutInflater.from(view.context)
                .inflate(R.layout.layout_custom_snackbar, null)

            // Bind elements
            val cardView = customView.findViewById<com.google.android.material.card.MaterialCardView>(R.id.cardSnackbar)
            val ivIcon = customView.findViewById<android.widget.ImageView>(R.id.ivSnackbarIcon)
            val tvMessage = customView.findViewById<android.widget.TextView>(R.id.tvSnackbarMessage)

            tvMessage.text = message

            // Apply color and icon dynamically
            val context = view.context
            val bgColor = if (isError) {
                context.resources.getColor(R.color.status_cancelled, context.theme)
            } else {
                context.resources.getColor(R.color.status_done, context.theme)
            }
            val iconRes = if (isError) R.drawable.ic_error else R.drawable.ic_success

            cardView.setCardBackgroundColor(android.content.res.ColorStateList.valueOf(bgColor))
            ivIcon.setImageResource(iconRes)

            layout.addView(customView, 0)
            snackbar.show()
        } catch (e: Exception) {
            Toast.makeText(view.context, message, Toast.LENGTH_SHORT).show()
        }
    }
}
