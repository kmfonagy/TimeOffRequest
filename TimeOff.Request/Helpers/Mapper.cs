using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace TimeOff.Request.Helpers
{
    public static class Mapper
    {
        public static bool IsPrimitiveType(this Type type) {
            return type.IsPrimitive || type == typeof(string) || type == typeof(decimal) || type == typeof(DateTime) || type == typeof(DateTimeOffset) || type == typeof(int?);
        }
        public static T Map<T>(this object obj) {
            var t = Activator.CreateInstance<T>();
            foreach (var prop in obj.GetType().GetProperties()) {
                var p = typeof(T).GetProperty(prop.Name);
                if (p != null) {
                    try {
                        if (p.PropertyType.IsPrimitiveType()) {
                            p.SetValue(t, prop.GetValue(obj));
                        }
                        else if (p.PropertyType.GetInterface("IEnumerable") != null && p.PropertyType.IsGenericType) {
                            var elementType = p.PropertyType.GenericTypeArguments.FirstOrDefault();
                            if (elementType != null) {
                                if (elementType.IsPrimitiveType()) {
                                    p.SetValue(t, prop.GetValue(obj));
                                }
                                else {
                                    Type listType = typeof(List<>).MakeGenericType(new Type[] { elementType });
                                    var list = Activator.CreateInstance(listType);
                                    foreach (var element in (IEnumerable)prop.GetValue(obj)) {
                                        list.GetType().GetMethod("Add").Invoke(list, new[] { element.Map(elementType) });
                                    }

                                    p.SetValue(t, list);
                                }
                            }
                        }
                        else if (p.PropertyType.IsArray) {
                            var elementType = p.PropertyType.GetElementType();
                            if (elementType.IsPrimitiveType()) {
                                p.SetValue(t, prop.GetValue(obj));
                            }
                            else {
                                p.SetValue(t, prop.GetValue(obj).Map(p.PropertyType));
                            }
                        }
                        else {
                            p.SetValue(t, prop.GetValue(obj).Map(p.PropertyType));
                        }
                    }
                    catch (Exception ex) { Console.WriteLine(ex.Message); }
                }
            }

            return t;
        }

        public static object Map(this object obj, Type targetType) {
            if (obj != null) {
                var t = Activator.CreateInstance(targetType);
                foreach (var prop in obj.GetType().GetProperties()) {
                    var p = targetType.GetProperty(prop.Name);
                    if (p != null) {
                        try {
                            if (p.PropertyType.IsPrimitiveType()) {
                                p.SetValue(t, prop.GetValue(obj));
                            }
                            else if (p.PropertyType.GetInterface("IEnumerable") != null && p.PropertyType.IsGenericType) {
                                var elementType = p.PropertyType.GetInterface("IEnumerable").GenericTypeArguments.FirstOrDefault();
                                if (elementType != null) {
                                    if (elementType.IsPrimitiveType()) {
                                        p.SetValue(t, prop.GetValue(obj));
                                    }
                                    else {
                                        Type listType = typeof(List<>).MakeGenericType(new Type[] { elementType });
                                        var list = Activator.CreateInstance(listType);
                                        foreach (var element in (IEnumerable)prop.GetValue(obj)) {
                                            list.GetType().GetMethod("Add").Invoke(list, new[] { element.Map(elementType) });
                                        }

                                        p.SetValue(t, list);
                                    }
                                }
                            }
                            else if (p.PropertyType.IsArray) {
                                var elementType = p.PropertyType.GetElementType();
                                if (elementType.IsPrimitiveType()) {
                                    p.SetValue(t, prop.GetValue(obj));
                                }
                                else {
                                    p.SetValue(t, prop.GetValue(obj).Map(p.PropertyType));
                                }
                            }
                            else {
                                p.SetValue(t, prop.GetValue(obj).Map(p.PropertyType));
                            }
                        }
                        catch { }
                    }
                }

                return t;
            }
            return null;
        }


        public static IEnumerable<T> MapCollection<T>(this ICollection collection) {
            foreach (var i in collection) {
                yield return i.Map<T>();
            }
        }

    }
}
