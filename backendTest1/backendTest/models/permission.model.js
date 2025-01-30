const mongoose = require("mongoose");
const PermissionSchema = new mongoose.Schema(
  {
    effect: {
      type: String,
      required: true,
      enum: ["allow", "deny"],
    },
    resource: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      role: {
        IN: {
          type: [String],
          default: [],
        },
        NIN: {
          type: [String],
          default: [],
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model("Permission", PermissionSchema);

module.exports = Permission;