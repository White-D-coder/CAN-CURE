/**
 * @typedef {string | number | boolean | null | { [key: string]: Json | undefined } | Json[]} Json
 */

/**
 * @typedef {Object} Database
 * @property {Object} public
 * @property {Object} public.Tables
 * @property {Object} public.Views
 * @property {Object} public.Functions
 * @property {Object} public.Enums
 * @property {Object} public.CompositeTypes
 */

/**
 * @typedef {Object} DefaultSchema
 */

/**
 * @template {keyof DefaultSchema["Tables"] & DefaultSchema["Views"] | { schema: keyof Database }} DefaultSchemaTableNameOrOptions
 * @template {DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]) : never} TableName
 * @typedef {DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R } ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R } ? R : never : never} Tables
 */

/**
 * @template {keyof DefaultSchema["Tables"] | { schema: keyof Database }} DefaultSchemaTableNameOrOptions
 * @template {DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never} TableName
 * @typedef {DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I } ? I : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I } ? I : never : never} TablesInsert
 */

/**
 * @template {keyof DefaultSchema["Tables"] | { schema: keyof Database }} DefaultSchemaTableNameOrOptions
 * @template {DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never} TableName
 * @typedef {DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U } ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U } ? U : never : never} TablesUpdate
 */

/**
 * @template {keyof DefaultSchema["Enums"] | { schema: keyof Database }} DefaultSchemaEnumNameOrOptions
 * @template {DefaultSchemaEnumNameOrOptions extends { schema: keyof Database } ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"] : never} EnumName
 * @typedef {DefaultSchemaEnumNameOrOptions extends { schema: keyof Database } ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions] : never} Enums
 */

/**
 * @template {keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database }} PublicCompositeTypeNameOrOptions
 * @template {PublicCompositeTypeNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"] : never} CompositeTypeName
 * @typedef {PublicCompositeTypeNameOrOptions extends { schema: keyof Database } ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName] : DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions] : never} CompositeTypes
 */

export const Constants = {
  public: {
    Enums: {},
  },
};
